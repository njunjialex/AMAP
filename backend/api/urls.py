from django.urls import path
from .views import get_products
from .views import get_slide_images

from rest_framework_simplejwt.views import TokenObtainPairView
from .views import CategoryListView

from .views import get_notification
from .views import register_user, login_user
from .views import upload_product
from .views import get_buyer_requests


from .views import get_market_prices
from .views import user_profile, change_password
from .views import order_tracking
from .views import chat_history
from .views import farmer_products, update_product, delete_product
from .views import get_orders, update_order_status, download_invoice
from django.urls import path
from .views import create_manual_order, accept_order
from .views import get_unassigned_orders, create_order, bookings_by_status_chart
from .views import initiate_mpesa_payment, mpesa_callback
from .views import get_logistics_providers, book_transport, register_logistics_provider
from .views import change_temp_password, user_bookings, update_delivery_status, logistics_analytics
from .views import ProfileView, EditProfileView, ChangePasswordView, create_review, get_user_reviews
from .views import list_users, admin_order_dashboard




urlpatterns = [
    path('admin/users/', list_users),
    path('admin/orders-dashboard/', admin_order_dashboard),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/edit/', EditProfileView.as_view(), name='edit-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path("change-temp-password/", change_temp_password, name="cahnge-temp-password"),
    path('logistics-register/', register_logistics_provider, name='logistics-register'),
    path('logistics-providers/',get_logistics_providers),
    path('book-transport/', book_transport),
    path("my-booking/", user_bookings),
    path("my-booking/<int:booking_id>/update-status/", update_delivery_status),
    path("logistics-analytics/", logistics_analytics),
    path("status-chart/", bookings_by_status_chart),
   
    path('initiate-payment/', initiate_mpesa_payment, name='initiate-payment'),
    path('mpesa/callback/', mpesa_callback, name='mpesa-callback'),    
    path("create-order/", create_order, name="create-order"),
    path("post-request/", create_manual_order, name="post-request"),
    path("accept-order/<int:order_id>/", accept_order, name="accept-order"),


    path("orders/", get_orders, name="get_orders"),
    path("orders/<int:order_id>/", get_orders, name="get_orders"),
    path("orders/<int:order_id>/update-status/", update_order_status, name="update_order_status"),
    path("orders/<int:order_id>/invoice/", download_invoice, name="download_invoice"),
    path("unassigned-orders/", get_unassigned_orders, name="unassigned-orders"),


    path("farmer-products/", farmer_products, name="farmer-products"),
    path("farmer-products/<int:product_id>/update/", update_product, name="update-product"),
    path("farmer-products/<int:product_id>/delete/", delete_product, name="delete-product"),

    path("api/chat/<int:farmer_id>/", chat_history, name="chat_history"),


    path("orders/", order_tracking, name="order_tracking"),
   
    path('market-prices/', get_market_prices, name="get_market_prices"),
    path('products/', get_products, name='get_products'),# Ensure this path exists
    path('slides/', get_slide_images, name='get_slide_images'),

    path("profile/", user_profile, name="profile"),
    path("change-password/", change_password, name="change-password"),

  

    path('upload-product/', upload_product, name='upload-product'),



    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
  
    path('categories/', CategoryListView.as_view(), name='category-list'),
    
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login_user'),

    
   # path("post-request/", post_request, name="post-request"),

    path("buyer-requests/", get_buyer_requests, name="buyer-requests"),
    
    path("notifications/", get_notification, name="notifications"),

    path('reviews/user/<int:user_id>/', get_user_reviews, name='user-reviews'),
    path('reviews/', create_review, name='create-review'),

]









    




