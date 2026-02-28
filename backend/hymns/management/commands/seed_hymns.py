import re
from pathlib import Path
from django.core.management.base import BaseCommand
from hymns.models import Hymn


class Command(BaseCommand):
    help = 'Seed hymns from src/hymns.js into the database.'

    def add_arguments(self, parser):
        parser.add_argument('--path', type=str, default=None, help='Path to hymns.js')

    def handle(self, *args, **options):
        default_path = Path(__file__).resolve().parents[5] / 'src' / 'hymns.js'
        path = Path(options['path']) if options['path'] else default_path

        if not path.exists():
            self.stderr.write(f"hymns.js not found at {path}")
            return

        content = path.read_text(encoding='utf-8')
        object_pattern = re.compile(r'\{[^{}]*"englishTitle"[^{}]*\}', re.DOTALL)
        objects = object_pattern.findall(content)

        if not objects:
            self.stderr.write('No hymns found to seed.')
            return

        created = 0
        updated = 0
        skipped = 0
        for obj in objects:
            title_match = re.search(r'"englishTitle"\s*:\s*"(?P<value>.*?)"', obj, re.DOTALL)
            coptic_match = re.search(r'"copticTitle"\s*:\s*"(?P<value>.*?)"', obj, re.DOTALL)
            audio_match = re.search(r'"audioFileLink"\s*:\s*"(?P<value>.*?)"', obj, re.DOTALL)
            season_match = re.search(r'"season"\s*:\s*"(?P<value>.*?)"', obj, re.DOTALL)

            title = (title_match.group('value') if title_match else '').strip()
            coptic_title = (coptic_match.group('value') if coptic_match else '').strip()
            audio_url = (audio_match.group('value') if audio_match else '').strip()
            season = (season_match.group('value') if season_match else '').strip()

            if not title or not audio_url:
                skipped += 1
                continue

            audio_url = audio_url.replace('http://media.tasbeha.org', 'https://media.tasbeha.org')
            cantor_match = re.search(r'/Cantor_([^/]+)/', audio_url, re.IGNORECASE)
            cantor = cantor_match.group(1).replace('_', ' ').strip() if cantor_match else ''

            obj, was_created = Hymn.objects.get_or_create(
                audio_url=audio_url,
                defaults={
                    'title': title,
                    'coptic_title': coptic_title,
                    'season': season,
                    'cantor': cantor,
                },
            )
            if was_created:
                created += 1
            else:
                fields_to_update = []
                if obj.title != title:
                    obj.title = title
                    fields_to_update.append('title')
                if obj.coptic_title != coptic_title:
                    obj.coptic_title = coptic_title
                    fields_to_update.append('coptic_title')
                if obj.season != season:
                    obj.season = season
                    fields_to_update.append('season')
                if obj.cantor != cantor:
                    obj.cantor = cantor
                    fields_to_update.append('cantor')

                if fields_to_update:
                    obj.save(update_fields=fields_to_update)
                    updated += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded hymns. Created: {created}, Updated: {updated}, Skipped: {skipped}'))
