from rest_framework import serializers

from .models import Product
from .models import Category
from django.contrib.auth.models import User

from django.contrib.auth import get_user_model


from .models import ProductRequest
from .models import Notification

from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

from django.contrib.auth import get_user_model


from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role"]

    def create(self, validated_data):

        validated_data['is_temp_password'] = False
        user = User.objects.create_user(**validated_data)  # Automatically hashes password
        return user



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")
        user = User.objects.filter(username=username).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)

            # Construct user data explicitly
            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "is_temp_password": user.is_temp_password  # Assuming this is a field on the model
            }

            return {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "is_temp_password": user.is_temp_password,
                "user": user_data  # ← wrap user info inside 'user'
            }

        raise serializers.ValidationError("Invalid credentials")



class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        farmer = serializers.CharField(source='farmer.user.username', read_only=True)
        model = Product
        fields = "__all__"




class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


#------------------------Product request--------------------------------
from .models import ProductRequest, Bid


from django.contrib.auth import get_user_model
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'phone']

class ProductRequestSerializer(serializers.ModelSerializer):
    buyer = serializers.CharField(source='buyer.user.username', read_only=True)  # Nested serializer
    farmer = UserSerializer(read_only=True)
    
    class Meta:
        model = ProductRequest
        fields = "__all__"


#-------------------------Notification-----------------------------------
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"

#-------------------------chat----------------------------
from rest_framework import serializers
from .models import ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "sender", "receiver", "message", "timestamp"]


#************************MarketPrice*******************************
from .models import MarketPrice

class MarketPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketPrice
        fields = '__all__'  # Expose all fields


from rest_framework import serializers
from django.contrib.auth import update_session_auth_hash
from .models import CustomUser

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["email", "first_name", "last_name", "phone", "location", "profile_photo"]

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("New passwords do not match.")
        return data

    def save(self, user):
        if not user.check_password(self.validated_data["old_password"]):
            raise serializers.ValidationError("Old password is incorrect.")
        
        user.set_password(self.validated_data["new_password"])
        user.save()
        update_session_auth_hash(self.context["request"], user)

#---------------------------order serializer--------------------------
from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
   

    class Meta:
        model = Order
        fields = "__all__"
    
#==========================Logistics Provider=====================
from rest_framework import serializers
from .models import LogisticsProvider
from django.contrib.auth import get_user_model

User = get_user_model()

class LogisticsProviderSerializer(serializers.ModelSerializer):
    # Additional fields for the user
    email = serializers.EmailField(write_only=True)
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(write_only=True)
    id = serializers.IntegerField(read_only=True)  # ✅ Include ID in the serialized output

    class Meta:
        model = LogisticsProvider
        fields = [
            "id",
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "phone_number",
            "company_name",
            "contact_email",
        ]

    def create(self, validated_data):
        # Extract user fields
        email = validated_data.pop("email")
        username = validated_data.pop("username")
        password = validated_data.pop("password")
        first_name = validated_data.pop("first_name")
        last_name = validated_data.pop("last_name")
        phone_number = validated_data.pop("phone_number")

        # Create the user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role="logistics_provider",
            is_temp_password=True,
            first_name=first_name,
            last_name=last_name,
            phone=phone_number,
        )

        # Create the logistics provider record
        provider = LogisticsProvider.objects.create(user=user, **validated_data)

        return provider


# serializers.py
from rest_framework import serializers
from .models import TransportBooking
from .models import LogisticsProvider


from django.contrib.auth import get_user_model
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'phone']  # Include fields you need

class TransportBookingSerializer(serializers.ModelSerializer):
    farmer = UserSerializer(read_only=True)  # Nested serializer
    logistics_provider = UserSerializer(read_only=True)  
    logistics_provider_username = serializers.CharField(source='logistics_provider.user.username', read_only=True)
    logistics_provider_phone = serializers.CharField(source='logistics_provider.user.phone', read_only=True)

    logistics_provider = serializers.PrimaryKeyRelatedField(queryset=LogisticsProvider.objects.all())

    class Meta:
        model = TransportBooking
        fields =[
           'id', 'order', 'farmer', 'logistics_provider', 'pickup_address', 
            'destination_address', 'expected_delivery', 'commodity','quantity', 'measure', 'status',
            'created_at', 'delivered_at', 'logistics_provider_username', 'logistics_provider_phone'
        ]

#==================PROFILE=======================

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    profile_photo = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'phone', 'location', 'profile_photo']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

class EditProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'location', 'profile_photo']


#=============REVIEWS++++++++++
from rest_framework import serializers
from .models import Review
User = get_user_model()
class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source="reviewer.get_full_name", read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'reviewer', 'reviewer_name', 'reviewed_user', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']
