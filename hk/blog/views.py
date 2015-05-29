from django.shortcuts import render
from django.template import RequestContext
from django.template.loader import get_template
from django.core.mail import EmailMultiAlternatives, EmailMessage
from django.http import HttpResponse, Http404
from django.contrib.auth.models import User
from django.contrib.auth import logout, authenticate, login
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, render
from django.views.decorators.csrf import csrf_exempt
from django.db.models import *
from django.forms.util import ValidationError
from django.contrib import messages
# Create your views here.

def main_page(request):
	return render_to_response('home.html', RequestContext(request))