# auctionhub/celery.py
import os
from celery import Celery

# set default Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "auctionhub.settings")

app = Celery("auctionhub")

# Load settings from Django settings.py with CELERY_ prefix
app.config_from_object("django.conf:settings", namespace="CELERY")

# Autodiscover tasks.py in installed apps
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f"Celery debug task: {self.request!r}")

from celery.schedules import crontab

app.conf.beat_schedule = {
    'assign-ended-auctions-every-minute': {
        'task': 'auctions.tasks.assign_all_ended_auctions',
        'schedule': crontab(minute='*'),  # every minute
    },
}

