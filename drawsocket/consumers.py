from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync, sync_to_async
from . import models
import json

class EchoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.layer_code = self.scope['url_route']['kwargs'].get('nickname')
        await self.channel_layer.group_add(self.layer_code, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.layer_code, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        patterns = await sync_to_async(models.LinePatterns.objects.get_or_create)(related_thread=self.layer_code)
        patterns = patterns[0]
        drawnLines = json.loads(patterns.line_pattern)
        processedData = [*drawnLines, text_data_json]
        patterns.line_pattern = json.dumps(processedData)
        await sync_to_async(patterns.save)()
        await self.channel_layer.group_send(
            self.layer_code,
            {
                'type': 'chat.message',
                'pattern': json.dumps(text_data_json)
            }
        )

    async def chat_message(self, event):
        message = event['pattern']
        print(message)
        await self.send(text_data=json.dumps({'pattern': message}))