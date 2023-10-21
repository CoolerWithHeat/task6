from django.db import models
import json

class LinePatterns(models.Model):
    related_thread = models.CharField(max_length=35, null=False, blank=False)
    line_pattern = models.CharField(max_length = 9999, default=json.dumps([]), blank=False)