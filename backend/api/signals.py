from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Order

@receiver(post_save, sender=Order)
def notify_buyer_on_acceptance(sender, instance, **kwargs):
    if instance.status == "Accepted":
        send_mail(
            "Your Order Has Been Accepted!",
            f"Your order for {instance.product_name} has been accepted by {instance.farmer.username}.",
            "your-email@example.com",
            [instance.buyer.email],
            fail_silently=True,
        )
