# reports/serializers/carotid_serializer.py

from reports.serializers.base_serializer import ExamBaseSerializer


class CarotidExamSerializer(ExamBaseSerializer):
    """
    Carotid-specific serializer. Inherits all core fields from ExamBaseSerializer.
    Can be extended with carotid-only logic in the future.
    """
    class Meta(ExamBaseSerializer.Meta):
        pass
