from rest_framework import serializers
from ...model.office_setup.level import Level_model
from rest_framework import serializers


class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level_model
        fields = ['id', 'level_name', 'level_eng_name', 'level_rank_number']

        # Override standard UniqueValidator error messages explicitly
        extra_kwargs = {
            'level_name': {
                'error_messages': {
                    'unique': 'यो स्तरको नाम प्रणालीमा अघि नै दर्ता भइसकेको छ।' # "This level name already exists"
                }
            },
            'level_rank_number': {
                'error_messages': {
                    'unique': 'यो मर्यादा क्रम (Rank) अघि नै अर्को स्तरलाई असाइन भइसकेको छ।' # "This rank already exists"
                }
            }
        }

    def validate(self, data):
        # clean empty strings → None (IMPORTANT FIX)
        for key, value in data.items():
            if value == "":
                data[key] = None
        return data