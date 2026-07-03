from rest_framework import serializers
from ...model.office_setup.designation import Designation_model
from rest_framework import serializers


class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation_model
        fields = ['id', 'designation_name', 'designation_eng_name', 'designation_rank_number']
        
        # Override standard UniqueValidator error messages explicitly
        extra_kwargs = {
            'designation_name': {
                'error_messages': {
                    'unique': 'यो पदको नाम प्रणालीमा अघि नै दर्ता भइसकेको छ।' # "This designation name already exists"
                }
            },
            'designation_rank_number': {
                'error_messages': {
                    'unique': 'यो मर्यादा क्रम (Rank) अघि नै अर्को पदलाई असाइन भइसकेको छ।' # "This rank already exists"
                }
            }
        }

    def validate(self, data):
        # clean empty strings → None (IMPORTANT FIX)
        for key, value in data.items():
            if value == "":
                data[key] = None
        return data