from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from .models import Product  # Ensure you have a Product model
from .models import SlideImage
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import ProductSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics
from .models import Category
from .serializers import CategorySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import get_user_model
from rest_framework import generics

from rest_framework.permissions import AllowAny
from .models import Notification
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes, parser_classes

User = get_user_model()

def home(request):
    return JsonResponse({'message': 'Hello from Django'})

def get_products(request):
    products = Product.objects.all().values("id", "name","farmer", "image", "selling_price", "description", "original_price", "measure")
    return JsonResponse(list(products), safe=False)


def get_slide_images(request):
    images = SlideImage.objects.all()
    data = [{"id": img.id, "image_url": request.build_absolute_uri(img.image.url)} for img in images]
    return JsonResponse(data, safe=False)


#from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, LoginSerializer

User = get_user_model()

@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "message": "Registration successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "role": user.role,
                
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)




#---------------------------product upload-----------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_product(request):
    
    data = request.data.copy()  # Make a mutable copy of request data
    data["farmer"] = request.user.id  # Assign authenticated user

    serializer = ProductSerializer(data=data)  # Pass modified data to serializer
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Product uploaded successfully!", "product": serializer.data}, status=201
        )
    
    return Response(serializer.errors, status=400)




class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

#------------------product request-----------------------------
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .serializers import ProductRequestSerializer

'''@api_view(["POST"])
@permission_classes([IsAuthenticated])  # ✅ Ensure user is logged in
def post_request(request):
    if request.user.role != "buyer":  # ✅ Check if the user is a buyer
        return Response({"error": "Only buyers can request a product."}, status=status.HTTP_403_FORBIDDEN)

    parser_classes = (MultiPartParser, FormParser)  # ✅ Handle file uploads if needed
    data = request.data.copy()
    data["buyer"] = request.user.id  # ✅ Assign logged-in user automatically

    serializer = ProductRequestSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Request posted successfully!", "product_request": serializer.data},
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''



#---------------------------product request view-------------------------------------
from .models import ProductRequest
from .serializers import ProductRequestSerializer
from rest_framework.decorators import api_view, permission_classes

@api_view(["GET"])
@permission_classes([AllowAny])
def get_buyer_requests(request):
    requests = ProductRequest.objects.select_related("buyer").all()
    serializer = ProductRequestSerializer(requests, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

    
#-----------------------category-------------------------------------
from rest_framework import generics
from .models import Category
from .serializers import CategorySerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
   

#-----------------------------Notification API-------------------
from .serializers import NotificationSerializer
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notification(request):
    
    notifications = Notification.objects.filter(user=request.user, is_read=False)
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


#----------------------------chatting API=--------------
from .models import ChatMessage
from .serializers import ChatMessageSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def chat_history(request, farmer_id):
    messages = ChatMessage.objects.filter(
        sender=request.user, receiver_id=farmer_id
    ) | ChatMessage.objects.filter(
        sender_id=farmer_id, receiver=request.user
    ).order_by("timestamp")

    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data)


#****************************MarketPrice ******************************
from rest_framework import viewsets
from .models import MarketPrice
from .serializers import MarketPriceSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def get_market_prices(request):


    marketprices = MarketPrice.objects.all().order_by('-date')
    serializer = MarketPriceSerializer(marketprices, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


#------------------------user profile-----------------------
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import update_session_auth_hash
from .serializers import UserProfileSerializer, ChangePasswordSerializer

User = get_user_model()

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])  # Allows file uploads
def user_profile(request):
    user = request.user

    if request.method == "GET":
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save()
        update_session_auth_hash(request, user)  # Keep the user logged in after password change
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



#-----------------------------------Orders------------------------------------------
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, permissions
from .models import ProductRequest
from .serializers import ProductRequestSerializer
from django.http import FileResponse
import os

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def order_tracking(request):
    """Fetch all orders for the logged-in buyer"""
    orders = ProductRequest.objects.filter(buyer=request.user)
    serializer = ProductRequestSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def order_detail(request, order_id):
    """Retrieve a specific order details"""
    try:
        order = ProductRequest.objects.get(id=order_id, buyer=request.user)
        serializer = ProductRequestSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ProductRequest.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def download_invoice(request, order_id):
    """Allow buyers to download the order invoice as a PDF"""
    invoice_path = f"media/invoices/order_{order_id}.pdf"
    if os.path.exists(invoice_path):
        return FileResponse(open(invoice_path, "rb"), as_attachment=True, filename=f"invoice_{order_id}.pdf")
    return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)


#-------------------------farmer products-------------------------
from rest_framework.decorators import api_view, permission_classes

from rest_framework import status, permissions
from .models import Product
from .serializers import ProductSerializer

# ✅ Fetch all products listed by the logged-in farmer
@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def farmer_products(request):
    products = Product.objects.filter(farmer=request.user)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# ✅ Update product details
@api_view(["PUT"])
@permission_classes([permissions.IsAuthenticated])
def update_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id, farmer=request.user)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Delete product
@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def delete_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id, farmer=request.user)
        product.delete()
        return Response({"message": "Product deleted successfully"}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)


#------------------------orders Views-----------------------------------


from .models import Order
from .serializers import OrderSerializer
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from io import BytesIO
from reportlab.pdfgen import canvas

'''# ✅ View Orders (For Both Farmers & Buyers)
@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def get_orders(request):
    user = request.user

    if user.role == "buyer":
        orders = Order.objects.filter(buyer=user)
    elif user.role == "farmer":
        orders = Order.objects.filter(farmer=user)
    else:
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
'''

# ✅ Update Order Status (Only Farmers)
@api_view(["PUT"])
@permission_classes([permissions.IsAuthenticated])
def update_order_status(request, order_id):
    user = request.user
    order = get_object_or_404(Order, id=order_id, farmer=user)  # Only the farmer can update

    new_status = request.data.get("status")
    if new_status not in ["Confirmed", "Shipped", "Delivered"]:
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    order.status = new_status
    order.save()
    return Response({"message": "Order status updated", "status": new_status}, status=status.HTTP_200_OK)


# ✅ View Order Details

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def get_orders(request, order_id=None):  # Make `order_id` optional
    if order_id:
        # Fetch a specific order
       
        order = get_object_or_404(Order, id=order_id)
        if request.user not in [order.buyer, order.farmer]:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ✅ Fetch all orders for the authenticated user
    
    orders = Order.objects.filter(buyer=request.user) | Order.objects.filter(farmer=request.user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

#===========================fetch orders without farmer ID========================
@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access
def get_unassigned_orders(request):
    # Fetch all orders where farmer_id is NULL (unassigned)
    unassigned_orders = Order.objects.filter(farmer_id__isnull=True)

    # Serialize the data
    serializer = OrderSerializer(unassigned_orders, many=True)

    return Response(serializer.data, status=200)



# ✅ Generate & Download Invoice (PDF)
@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def download_invoice(request, order_id):
    order = get_object_or_404(Order, id=order_id)

    if request.user not in [order.buyer, order.farmer]:
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer)
    pdf.drawString(100, 800, f"Invoice for Order {order.id}")
    pdf.drawString(100, 780, f"Buyer: {order.buyer.username} ({order.buyer.email})")
    pdf.drawString(100, 760, f"Farmer: {order.farmer.username}")
    pdf.drawString(100, 740, f"Product: {order.product_name}")
    pdf.drawString(100, 720, f"Quantity: {order.quantity}{order.measure}")
    pdf.drawString(100, 700, f"Total Cost: KES {order.amount}")
    pdf.drawString(100, 680, f"Expected Delivery: {order.expected_delivery}")
    pdf.showPage()
    pdf.save()
    buffer.seek(0)

    return FileResponse(buffer, as_attachment=True, filename=f"invoice_{order.id}.pdf")


#========================create Manual Order============================
from django.http import JsonResponse
import json
from .models import Order
from django.utils.decorators import method_decorator

from rest_framework.decorators import api_view

from .models import Order
from .serializers import OrderSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_manual_order(request):
    if request.method == "POST":
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"error": "Invalid request"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


#=========================Listings Orders=======================

from .models import Order, Product, User
from .serializers import OrderSerializer

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def create_order(request):
    buyer = request.user
    product_id = request.data.get("product_id")
    
    

    try:
        product = Product.objects.get(id=product_id)
        farmer = product.farmer
        order = Order.objects.create(
            buyer=buyer,
            product_id=product,
            farmer=farmer,
            product_name=product.name,
            quantity=request.data["quantity"],
            measure=product.measure,
            amount=request.data["amount"],
            expected_delivery=request.data["expected_delivery"],
            address=request.data["address"],
            additional_notes=request.data.get("additional_notes", ""),
            status="Pending",
            payment_status="Not Paid",
        )

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




#========================Farmer Accept Order============================
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order, Notification

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def accept_order(request, order_id):
    try:
        order = get_object_or_404(Order, id=order_id)

        if order.farmer_id is not None:
            return Response({"message": "Order already assigned to a farmer"}, status=400)

        order.farmer = request.user
        order.save()

        # 🔔 Notification
        Notification.objects.create(
            user=order.buyer,
            message=f"Your order for {order.product_name} has been accepted by {request.user.username}."
        )

        # 📧 Send email to buyer
        send_mail(
            subject="Order Accepted!",
            message=f"Hello {order.buyer.first_name},\n\nYour order for '{order.product_name}' has been accepted by {request.user.get_full_name()}.\nWe’ll keep you updated as it progresses.\n\nThanks for using our platform!",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.buyer.email],
            fail_silently=False,
        )

        return Response({"message": "Order accepted successfully!", "order_id": order.id}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)




#----------------------Mpesa payment Gateway----------------------
import requests, base64
from decouple import config
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Order

def get_mpesa_token():
    consumer_key = config("MPESA_CONSUMER_KEY")
    consumer_secret = config("MPESA_CONSUMER_SECRET")
    response = requests.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        auth=(consumer_key, consumer_secret),
    )
    return response.json().get("access_token")

import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from decouple import config
from django.utils import timezone
from .models import Order

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def initiate_mpesa_payment(request):
    print("Request Data:", request.data)


    order_id = request.data.get("order_id")
    phone = request.data.get("phone")

    if not order_id or not phone:
        return Response({"error": "Missing order_id or phone"}, status=400)

    try:
        order = Order.objects.get(id=order_id, buyer=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    amount = order.amount
    phone = phone.strip().replace(" ", "")

    # Format phone for M-Pesa (Safaricom requires 2547... format)
    if phone.startswith("0"):
        phone = "254" + phone[1:]

    # STK Push parameters
    business_short_code = config("MPESA_SHORTCODE")
    passkey = config("MPESA_PASSKEY")
    consumer_key = config("MPESA_CONSUMER_KEY")
    consumer_secret = config("MPESA_CONSUMER_SECRET")
    callback_url = "https://yourdomain.com/api/mpesa/callback/"

    timestamp = timezone.now().strftime("%Y%m%d%H%M%S")
    password = (business_short_code + passkey + timestamp).encode("utf-8")
    from base64 import b64encode
    encoded_password = b64encode(password).decode("utf-8")

    # Generate access token
    try:
        auth_response = requests.get(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
            auth=(consumer_key, consumer_secret)
        )
        access_token = auth_response.json().get("access_token")
    except Exception as e:
        return Response({"error": "Failed to authenticate with M-Pesa", "details": str(e)}, status=500)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "BusinessShortCode": business_short_code,
        "Password": encoded_password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone,
        "PartyB": business_short_code,
        "PhoneNumber": phone,
        "CallBackURL": callback_url,
        "AccountReference": f"ORDER{order.id}",
        "TransactionDesc": f"Payment for Order {order.id}"
    }

    try:
        stk_response = requests.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers=headers
        )

        print("STK Response:", stk_response.text)
        if stk_response.status_code != 200:
            return Response({"error": "STK push failed", "details": stk_response.text}, status=400)

        return Response({"message": "STK push sent. Please complete the payment on your phone."})
    except Exception as e:
        return Response({"error": "Failed to initiate STK push", "details": str(e)}, status=500)



#------------Mpesa callback View__-------------------
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
from .models import Order
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  # Safely allow Safaricom server access
def mpesa_callback(request):
    try:
        mpesa_body = request.data
        logger.info(f"Mpesa Callback Data: {json.dumps(mpesa_body, indent=2)}")

        # Extract important fields
        body = mpesa_body.get("Body", {}).get("stkCallback", {})
        result_code = body.get("ResultCode")
        result_desc = body.get("ResultDesc")
        checkout_request_id = body.get("CheckoutRequestID")

        if result_code == 0:
            callback_metadata = body.get("CallbackMetadata", {}).get("Item", [])

            # Extract payment details
            mpesa_code = None
            amount = 0
            phone_number = None
            transaction_date = None

            for item in callback_metadata:
                name = item.get("Name")
                if name == "MpesaReceiptNumber":
                    mpesa_code = item.get("Value")
                elif name == "Amount":
                    amount = item.get("Value")
                elif name == "PhoneNumber":
                    phone_number = item.get("Value")
                elif name == "TransactionDate":
                    raw_date = item.get("Value")
                    transaction_date = parse_datetime(str(raw_date))  # Optional

            # Match the order (Assumes phone_number is unique to buyer)
            order = Order.objects.filter(buyer__phone_number=phone_number, amount=amount, payment_status="Not Paid").last()

            if order:
                order.payment_status = "Paid"
                order.status = "Paid"
                order.save()

                logger.info(f"Order #{order.id} marked as Paid with M-Pesa code {mpesa_code}")
                return Response({"message": "Payment processed successfully."}, status=200)
            else:
                logger.warning("Matching order not found or already paid.")
                return Response({"message": "Order not found or already paid."}, status=404)

        else:
            logger.warning(f"M-Pesa STK Push failed: {result_desc}")
            return Response({"message": f"Payment failed: {result_desc}"}, status=400)

    except Exception as e:
        logger.error(f"Error handling M-Pesa callback: {str(e)}")
        return Response({"error": "Failed to process callback."}, status=500)



#=====================Transport Booking==================================

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import TransportBooking, LogisticsProvider
from .serializers import TransportBookingSerializer
from django.shortcuts import get_object_or_404

# ✅ View bookings assigned to a logistics provider
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def provider_bookings(request):
    try:
        provider = LogisticsProvider.objects.get(user=request.user)
        bookings = TransportBooking.objects.filter(provider=provider)
        serializer = TransportBookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except LogisticsProvider.DoesNotExist:
        return Response({"error": "You are not registered as a logistics provider."}, status=status.HTTP_403_FORBIDDEN)


# ✅ Update booking status
from django.core.mail import send_mail
from django.conf import settings

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_delivery_status(request, booking_id):
    try:
        provider = LogisticsProvider.objects.get(user=request.user)
        booking = get_object_or_404(TransportBooking, id=booking_id, logistics_provider=provider)

        status_update = request.data.get("status")
        if status_update not in ["Pending", "Confirmed", "In Transit", "Delivered"]:
            return Response({"error": "Invalid delivery status."}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = status_update

        # Set delivery timestamp when delivered
        if status_update == "Delivered":
            booking.delivered_at = timezone.now()

        booking.save()

        # Send email to farmer
        send_mail(
            subject="Transport Booking Status Update",
            message=(
                f"Dear {booking.farmer.username},\n\n"
                f"Your transport booking (ID: {booking.id}) has been updated to: '{status_update}'.\n\n"
                f"Thank you for using AMAP Logistics."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.farmer.email],
            fail_silently=False,
        )

        # Send notification
        Notification.objects.create(
            user=booking.farmer,
            message=f"Your transport booking (ID: {booking.id}) has been updated to: '{status_update}'."
        )

        return Response({"message": "Delivery status updated and notification sent."}, status=status.HTTP_200_OK)

    except LogisticsProvider.DoesNotExist:
        return Response({"error": "Unauthorized. Not a logistics provider."}, status=status.HTTP_403_FORBIDDEN)


#==========================Logistic_provider Registration======================
import secrets
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
#from rest_framework.permissions import IsAdminUser

User = get_user_model()

@api_view(["POST"])
@permission_classes([AllowAny])
def register_logistics_provider(request):
    serializer = LogisticsProviderSerializer(data=request.data)

    if serializer.is_valid():
        
        provider = serializer.save()

        # Use the password that was typed in (from request)
        temp_password = request.data.get("password")
        username = request.data.get("username")
        email = request.data.get("email")

        send_mail(
            subject="Welcome to AMAP Logistics Platform",
            message=f"Hi {username},\n\nYou've been registered as a Logistics Provider.\nTemporary password: {temp_password}\nPlease login and change your password.",
            from_email="alexwanjohi55@gmail.com",
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({
            "message": f"Logistics provider {username} created and emailed temporary password."
        }, status=201)
    print(serializer.errors)

    return Response(serializer.errors, status=400)


#======================Change pASSWORD ================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_temp_password(request):
    user = request.user
    new_password = request.data.get("new_password")

    if not new_password:
        return Response({"error": "New password is required"}, status=400)

    user.set_password(new_password)
    user.is_temp_password = False
    user.save()

    return Response({"message": "Password updated successfully"}, status=200)


#+++++++++++++++++++++Get logistics Provider==============================
from .models import TransportBooking, LogisticsProvider, Order
from .serializers import TransportBookingSerializer, LogisticsProviderSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logistics_providers(request):
    providers = LogisticsProvider.objects.all()
    serializer = LogisticsProviderSerializer(providers, many=True)
    print(providers)
    return Response(serializer.data)

from .models import TransportBooking, Order
from .serializers import TransportBookingSerializer

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def book_transport(request):
    serializer = TransportBookingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(farmer=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_bookings(request):
    user = request.user

    if user.role == "farmer":
        bookings = TransportBooking.objects.filter(farmer=user)
    elif user.role == "logistics_provider":
        try:
            provider = user.logisticsprovider
            bookings = TransportBooking.objects.filter(logistics_provider=provider)
        except LogisticsProvider.DoesNotExist:
            return Response({"error": "Logistics provider profile not found."}, status=404)
    else:
        return Response({"error": "Unauthorized role."}, status=403)

    serializer = TransportBookingSerializer(bookings, many=True)
    return Response(serializer.data)

#=======Logistics Analytics==================
from django.db.models import Count
from django.db.models import Avg, F, ExpressionWrapper, DurationField
from datetime import timedelta
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def logistics_analytics(request):
    provider = get_object_or_404(LogisticsProvider, user=request.user)

    total_bookings = TransportBooking.objects.filter(logistics_provider=provider).count()

    bookings_by_status = (
        TransportBooking.objects
        .filter(logistics_provider=provider)
        .values('status')
        .annotate(count=Count('id'))
    )

    delivered = TransportBooking.objects.filter(logistics_provider=provider, status="Delivered").count()
    completion_rate = (delivered / total_bookings * 100) if total_bookings else 0

    average_delivery_time = TransportBooking.objects.filter(
        logistics_provider=provider,
        status="Delivered",
        delivered_at__isnull=False
    ).annotate(
        delivery_time=ExpressionWrapper(F('delivered_at') - F('created_at'), output_field=DurationField())
    ).aggregate(average=Avg('delivery_time'))["average"]

    return Response({
        "total_bookings": total_bookings,
        "bookings_by_status": bookings_by_status,
        "completion_rate": completion_rate,
        "average_delivery_time": average_delivery_time
    })

#barchart
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import TransportBooking, LogisticsProvider

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def bookings_by_status_chart(request):
    try:
        provider = LogisticsProvider.objects.get(user=request.user)
        bookings = TransportBooking.objects.filter(logistics_provider=provider)

        # Count bookings by status
        status_counts = bookings.values('status').annotate(count=Count('id'))

        return Response(status_counts)

    except LogisticsProvider.DoesNotExist:
        return Response({"error": "Unauthorized"}, status=403)


#========================PROFILE========================
# views.py

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password

from .serializers import ProfileSerializer, ChangePasswordSerializer, EditProfileSerializer

User = get_user_model()

class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class EditProfileView(generics.UpdateAPIView):
    serializer_class = EditProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'old_password': 'Wrong password.'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'detail': 'Password updated successfully.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#++=================REVIEWS++++++++++++++++++++++++++
from rest_framework.decorators import api_view, permission_classes
from .models import Review
from .serializers import ReviewSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):
    data = request.data.copy()
    data['reviewer'] = request.user.id  # Enforce that the logged-in user is the reviewer

    # Optional: validate that reviewed_user exists
    reviewed_user_id = data.get('reviewed_user')
    #if not User.objects.filter(id=reviewed_user_id).exists():
    #    return Response({'error': 'Reviewed user not found.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = ReviewSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#----------------get user reviews=============================

from rest_framework.permissions import AllowAny
from .models import Review
from .serializers import ReviewSerializer

@api_view(['GET'])
@permission_classes([AllowAny])  # or IsAuthenticated if needed
def get_user_reviews(request, user_id):
    reviews = Review.objects.filter(reviewed_user_id=user_id).order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


#=======================Admin users view
from rest_framework.decorators import api_view, permission_classes
#from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from collections import Counter

User = get_user_model()

@api_view(["GET"])
@permission_classes([AllowAny])
def list_users(request):
    users = User.objects.all()
    role_counts = Counter(user.role for user in users)

    data = {
        "cards": {
            "Total Users": users.count(),
            "Registered Farmers": role_counts.get("farmer", 0),
            "Registered Buyers": role_counts.get("buyer", 0),
            "Registered Logistics Providers": role_counts.get("logistics_provider", 0),
        },
        "users": [
            {"id": user.id, "username": user.username, "email": user.email, "role": user.role}
            for user in users
        ],
    }
    return Response(data)


#=================Admin Orders View======
# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def admin_order_dashboard(request):
    orders = Order.objects.all()
    total = orders.count()
    confirmed = orders.filter(status="Confirmed").count()
    delivered = orders.filter(status="Delivered").count()
    pending = orders.filter(status="Pending").count()
    shipped = orders.filter(status="Shipped").count()

    serializer = OrderSerializer(orders, many=True)

    return Response({
        "orders": serializer.data,
        "stats": {
            "Total Orders": total,
            "Confirmed": confirmed,
            "Delivered": delivered,
            "Pending": pending,
            "Shipped": shipped,
        }
    })

