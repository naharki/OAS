from urllib import request
from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .models import App
from .serializers import (
    UserSerializer,
    AdminCreateSerializer,
    UserCreateSerializer,
    AppSerializer,
    AdminUpdateSerializer
)
from .permissions import IsSuperAdmin, IsAdmin

# for login 
class LoginView(APIView):
   authentication_classes = []
   permission_classes = []

   def post(self, request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username = username , password= password)
    if not user : 
        return Response(
        {"error": "Invalid username or password"}, status= status.HTTP_401_UNAUTHORIZED
        )
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)
    response = Response({
       "message": "Login Successful",
       'user': UserSerializer(user).data,
    })
    response.set_cookie(
        key = 'access_token',
        value = access,
        httponly = True,
        samesite='None',
        secure= True,
        max_age= 15*60,  # 15 minutes
        path="/",
    )
    response.set_cookie(
        key = 'refresh_token',
        value = str(refresh),
        httponly = True,
        samesite='None',
        secure= True,
        max_age= 7*24*60*60,  # 7 days
        path="/",
    )
    return response
   
#    logout view
class LogOutView (APIView):
    # permission_classes = [IsAuthenticated]
    permission_classes = []

    def post(self, request):
       refresh_token = request.COOKIES.get('refresh_token')
       if refresh_token : 
          try: 
             RefreshToken(refresh_token).blacklist()
          except Exception:
             pass
       response = Response ({"message": "Logout Successful"}, status= status.HTTP_200_OK)
       response.delete_cookie(
            key="access_token",
            path="/",
            samesite="None",
     
        )

       response.delete_cookie(
            key="refresh_token",
            path="/",
            samesite="None",
        
        )

       return response
    
# superadmin 
class CreateAppView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def post(self, request):
        serializer = AppSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'App created successfully'}, status=status.HTTP_201_CREATED)

# list all the app : 
class AppListView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):
        apps = App.objects.all()
        serializer = AppSerializer(apps, many=True)
        return Response(serializer.data)
          
        
class CreateAdminView(APIView):
   permission_classes = [IsAuthenticated, IsSuperAdmin]

   def post(self, request):
         serializer = AdminCreateSerializer(data=request.data)
         if serializer.is_valid(raise_exception=True):
              serializer.save()
              return Response({'message': 'Admin created successfully'}, status=status.HTTP_201_CREATED)
# list admin view 

class AdminListView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):
        # admins_ids = request.user.assigned_apps.values_list('admins', flat=True).distinct()
        admins = User.objects.filter(role='admin').distinct()
        serializer = UserSerializer(admins, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminDetailView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def put(self, request,pk):
        try:
            admin = User.objects.get(pk=pk, role='admin')    
        except User.DoesNotExist:
            return Response({'error': 'Admin not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AdminUpdateSerializer(admin, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Admin updated successfully'}, status=status.HTTP_200_OK)
    
class AdminDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def delete(self, request, pk):
        try:
            admin = User.objects.get(pk=pk, role='admin')
        except User.DoesNotExist:
            return Response(
                {'error': 'Admin not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if admin == request.user:
            return Response(
                {"error": "You cannot delete yourself"},
                status=status.HTTP_400_BAD_REQUEST
            )

        admin.delete()

        return Response(
            {'message': 'Admin deleted successfully'},
            status=status.HTTP_200_OK
        )

# admin
class CreateUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        app_id = request.data.get('app')
        if not request.user.assigned_apps.filter(id=app_id).exists():
            return Response({'error': 'You do not have permission to add users to this app.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    

# get user details
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
       return Response(UserSerializer(request.user).data) 
    
