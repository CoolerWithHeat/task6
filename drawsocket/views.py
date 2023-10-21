from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from . import models
from .serializers import *
import json

class GetPatterns(APIView):
    def get(self, request, thread_name):
        thread = models.LinePatterns.objects.get_or_create(related_thread=thread_name)
        if (thread):
            return Response({'pattern':json.loads(thread[0].line_pattern)}, status=200)
        else:
            return Response(status=500)
        
class All_Threads(APIView):
    def get(self, request):
        thread = models.LinePatterns.objects.all()
        serialized = ThreadsSerializer(thread, many=True)
        return Response({'threads': serialized.data}, status=200)

class Clear_Thread(APIView):
    def post(self, request, thread_name):
        # try:   
        thread = models.LinePatterns.objects.get(related_thread=thread_name)
        thread.line_pattern = json.dumps([])
        thread.save()
        return Response(status=200)
        # except:
        #     return Response(status=500)

@csrf_exempt        
def CentralCore(request, **kwargs):
    return render(request, 'index.html')