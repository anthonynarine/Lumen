# Generated by Django 5.2.1 on 2025-06-27 19:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("reports", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="measurement",
            name="calculated_fields",
            field=models.JSONField(
                blank=True,
                default=dict,
                help_text="Derived metrics like ICA/CCA ratio, stenosis category, etc.",
            ),
        ),
    ]
