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
        pattern = re.compile(r'"englishTitle"\s*:\s*"(?P<title>.*?)".*?"audioFileLink"\s*:\s*"(?P<audio>.*?)"', re.DOTALL)
        matches = pattern.findall(content)

        if not matches:
            self.stderr.write('No hymns found to seed.')
            return

        created = 0
        updated = 0
        for title, audio_url in matches:
            obj, was_created = Hymn.objects.get_or_create(
                audio_url=audio_url,
                defaults={'title': title},
            )
            if was_created:
                created += 1
            else:
                if obj.title != title:
                    obj.title = title
                    obj.save(update_fields=['title'])
                    updated += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded hymns. Created: {created}, Updated: {updated}'))
