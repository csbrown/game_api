from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader, Context

def tictactoe(request):
    template = loader.get_template('games/tictactoe.html')
    return HttpResponse(template.render(Context()))

def index(request):
    return HttpResponse("We're still working on this... Hold tight")
