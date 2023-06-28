from rest_framework import serializers

from feedbacks.models import DanceableFeedback


class DanceableSectionSerializer(serializers.ModelSerializer):
    feedbackId = serializers.UUIDField(source='feedback_id')
    firstScore = serializers.URLField(source='first_score')
    bestScore = serializers.URLField(source='best_score')

    class Meta:
        model = DanceableFeedback
        fields = ['feedbackId', 'video', 'firstScore', 'bestScore']
