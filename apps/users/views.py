from django.contrib import messages
from django.contrib.auth.models import User, auth
from django.shortcuts import render, redirect
from django.db import IntegrityError

def userLogin(request):
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user_obj = User.objects.get(email=email)
            user = auth.authenticate(request, username=user_obj.username, password=password)
            if user is not None:
                auth.login(request, user)
                return redirect('/')
            else:
                messages.warning(request, "Invalid email or password.")
        except User.DoesNotExist:
            messages.warning(request, "Invalid email or password.")
        except Exception as e:
            messages.error(request, "An unexpected error occurred. Please try again.")
    return render(request, "login.html")

def logout(request):
    auth.logout(request)
    return redirect('/')

import uuid
import re

def register(request):
    if request.method == "POST":
        firstname = request.POST.get('firstname', '').strip()
        lastname = request.POST.get('lastname', '').strip()
        password = request.POST.get('password', '')
        confirmpassword = request.POST.get('confirmpassword', '')
        email = request.POST.get('email', '').strip().lower()

        errors = []
        
        # Strict email validation
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, email):
            errors.append("Please enter a valid email address.")
            
        if password != confirmpassword:
            errors.append("Passwords do not match.")
            
        if len(password) < 6:
            errors.append("Password must be at least 6 characters.")
            
        if User.objects.filter(email__iexact=email).exists():
            errors.append("This email is already registered. Please log in.")
            
        if errors:
            for error in errors:
                messages.error(request, error)
            return redirect('register')

        try:
            # Auto-generate unique username
            username = email.split('@')[0][:15] + "_" + uuid.uuid4().hex[:6]
            
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name=firstname,
                last_name=lastname
            )
            
            # Frictionless E-commerce UX: Auto Login after registration
            user = auth.authenticate(request, username=username, password=password)
            if user is not None:
                auth.login(request, user)
                messages.success(request, f"Welcome to Topnoz, {firstname}!")
                return redirect('/')
            else:
                messages.success(request, "Account created successfully! Please log in.")
                return redirect('userLogin')
                
        except Exception as e:
            messages.error(request, "Error creating account. Please try again.")
            return redirect('register')
            
    return render(request, "register.html")
