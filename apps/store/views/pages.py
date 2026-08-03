from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.urls import reverse

def contact(request):
    if request.method == "POST":
        message_name = request.POST.get('message_name', '')
        message_email = request.POST.get('message_email', '')
        user_message = request.POST.get('user_message', '')
        full_message = f"Sender Name: {message_name}\nSender Email: {message_email}\n\nMessage:\n{user_message}"
        send_mail(
            f'Contact Message From {message_name}',
            full_message,
            'topnozweb@gmail.com',
            ['topnozweb@gmail.com'],
            fail_silently=True
        )
        return redirect(f"{reverse('contact')}?success=1&name={message_name}")
    congratulations_message = None
    if request.GET.get('success') == '1':
        congratulations_message = f"{request.GET.get('name')}, your email has been received!"
    return render(request, "contact.html", {
        'congratulations_message': congratulations_message
    })

def chatbot_view(request):
    return render(request, 'chatbot.html')
