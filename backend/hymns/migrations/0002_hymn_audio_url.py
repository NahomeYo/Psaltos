from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hymns', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='hymn',
            name='audio_url',
            field=models.URLField(blank=True),
        ),
        migrations.AlterField(
            model_name='hymn',
            name='audio_file',
            field=models.FileField(blank=True, null=True, upload_to='hymns/'),
        ),
    ]
