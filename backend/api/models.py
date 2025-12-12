from django.db import models

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf import settings
from django.contrib.auth import get_user_model

# Create your models here.






#-----------------------slide---------------------------------------
class SlideImage(models.Model):
    image = models.ImageField(upload_to='slides/')  # Store images in 'media/slides/'
    title = models.CharField(max_length=100, blank=True, null=True)  # Optional title
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"Slide {self.id}"


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# Custom User Model with Role Field
class CustomUser(AbstractUser):
    
    # ✅ Common fields for both farmers & buyers
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
   

    ROLE_CHOICES = [
        ('farmer', 'Farmer'),
        ('buyer', 'Buyer'),
        ('logistics_provider', 'Logistics Provider'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)

    # ✅ Specific to Farmers
    farming_type = models.CharField(max_length=100, blank=True, null=True)
    is_temp_password = models.BooleanField(default=True)
   

    def __str__(self):
        return self.username


    # Fixing the reverse accessor conflict
    groups = models.ManyToManyField(Group, related_name="custom_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)


User = get_user_model()
class Product(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="product")
    category = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    description = models.TextField()
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    measure = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    image = models.ImageField(upload_to='products/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.farmer}"



    
User = get_user_model()
class ProductRequest(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=255)
    quantity = models.IntegerField()
    measure = models.CharField(max_length=100)
    buying_price = models.IntegerField(default= 10)
    expected_delivery = models.DateField()
    location = models.CharField(max_length=255)
    additional_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product_name} - {self.buyer.username}"
    

    
class Bid(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
    ]
    request = models.ForeignKey(ProductRequest, on_delete=models.CASCADE)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_time = models.IntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)




class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username} - {self.message}"


 #-------------------chat system------------------   
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatMessage(models.Model):
    sender = models.ForeignKey(User, related_name="sent_messages", on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name="received_messages", on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.message[:20]}"



#------------------------Market Price Model---------------------------
from django.db import models

class MarketPrice(models.Model):
    commodity = models.CharField(max_length=255)
    wholesale = models.CharField(max_length=255)
    retail = models.CharField(max_length=255)
    county = models.CharField(max_length=255)
    date = models.DateField()

    def __str__(self):
        return f"{self.commodity} - {self.wholesale} - {self.retail}"


#------------------------orders================================
from django.db import models
from django.conf import settings
from api.models import Product  # Assuming Product model exists
from datetime import timedelta, date

from django.db import models

User = get_user_model()
class Order(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    farmer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="accepted_orders")
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    measure = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    expected_delivery = models.DateField()
    address = models.CharField(max_length=255)
    additional_notes = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ("Pending", "Pending"),
            ("Accepted", "Accepted"),
            ("Paid", "Paid"),
            ("Shipped", "Shipped"),
            ("Delivered", "Delivered"),
        ],
        default="Pending"
    )
    payment_status= models.CharField(max_length=70, default="Not Paid")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.product_name} ({self.status})"

# ===================Logistics Providers========================
class LogisticsProvider(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=100)
    contact_email = models.EmailField(default="company@gmail.com")

    def __str__(self):
        return self.company_name

#+=========================Transport Booking=============================

class TransportBooking(models.Model):
    order = models.ForeignKey("Order", on_delete=models.CASCADE, related_name="transport_bookings")
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    logistics_provider = models.ForeignKey("LogisticsProvider", on_delete=models.CASCADE)
    pickup_address = models.CharField(max_length=255)
    destination_address = models.CharField(max_length=255)
    expected_delivery = models.DateField()
    commodity = models.CharField(max_length=100, default="productname")
    quantity = models.PositiveIntegerField()
    measure = models.CharField(max_length=100, default="units")
    status = models.CharField(max_length=50, choices=[
        ("Pending", "Pending"),
        ("In Transit", "In Transit"),
        ("Delivered", "Delivered"),
    ], default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)
    delivered_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)


    def __str__(self):
        return f"Transport Booking for Order #{self.order.id}"


#===============REVIEWS==============
class Review(models.Model):
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)  # Buyer
    reviewed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')  # Farmer or provider
    rating = models.IntegerField()  # 1 to 5
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)










