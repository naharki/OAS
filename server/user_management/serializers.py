from rest_framework import serializers
from .models import User,  App

class AppSerializer(serializers.ModelSerializer):
    class Meta:
        model = App
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    accessible_apps = AppSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'accessible_apps']

class AdminCreateSerializer(serializers.ModelSerializer):
   apps = serializers.PrimaryKeyRelatedField(
       queryset = App.objects.all(),
         many = True,
            write_only = True,
    )
   class Meta:
       model = User
       fields = ['username', 'email', 'password', 'apps']
       extra_kwargs = {'password': {'write_only': True}}

   def create(self, validated_data):
       apps = validated_data.pop('apps')
       user = User.objects.create_user(role= 'admin', **validated_data)
       user.assigned_apps.set(apps)
       return user
   
class AdminUpdateSerializer(serializers.ModelSerializer):
   apps = serializers.PrimaryKeyRelatedField(
       queryset = App.objects.all(),
         many = True,
        required = False,
        source = 'assigned_apps'
    )
   class Meta:
       model = User
       fields = ['username', 'email', 'password', 'apps']
       extra_kwargs = {
           "password":{'required': False, 'write_only': True}
       }

   def update(self, instance, validated_data):
       apps = validated_data.pop('assigned_apps', None)
       password = validated_data.pop('password', None)

       for attr, value in validated_data.items():
           setattr(instance, attr, value)
       if password:
            instance.set_password(password)
       instance.save()
       if apps is not None:
           instance.assigned_apps.set(apps)
       return instance

class UserCreateSerializer(serializers.ModelSerializer):
      app = serializers.PrimaryKeyRelatedField(
            queryset = App.objects.all(),
                write_only = True
        )
      class Meta:
          model = User
          fields = ['username', 'email', 'password', 'app']
          extra_kwargs = {'password': {'write_only': True}}

      def create(self, validated_data):
          app = validated_data.pop('app')
          user = User.objects.create_user(role= 'data_entry', **validated_data) 
          user.assigned_apps.add(app) 
          return user