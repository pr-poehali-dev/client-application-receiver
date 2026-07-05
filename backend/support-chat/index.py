import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    '''Чат-бот поддержки клиентов: отвечает на вопросы и помогает решить описанные проблемы'''
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Метод не поддерживается'})}

    body = json.loads(event.get('body') or '{}')
    messages = body.get('messages', [])

    if not messages:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Пустой запрос'})}

    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': 'Ключ API не настроен'})}

    system_prompt = (
        'Ты — вежливый и профессиональный ассистент поддержки клиентов компании '
        '"EM Group Технолоджи". Помогай клиентам решать проблемы: технические вопросы, '
        'вопросы по оплате, статусам заявок, договорам и логистике. '
        'Отвечай кратко, дружелюбно и по существу на русском языке. '
        'Если проблему нельзя решить сразу, предложи оформить заявку в разделе "Новая заявка" '
        'и укажи, к какому отделу она относится (Продажи, Техподдержка, Финансы, Юридический, Логистика).'
    )

    payload = {
        'model': 'gpt-4o-mini',
        'messages': [{'role': 'system', 'content': system_prompt}] + messages,
        'temperature': 0.6,
        'max_tokens': 500,
    }

    req = urllib.request.Request(
        'https://api.openai.com/v1/chat/completions',
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = json.loads(resp.read().decode('utf-8'))
        reply = data['choices'][0]['message']['content']
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'reply': reply})}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {'statusCode': 502, 'headers': headers, 'body': json.dumps({'error': 'Ошибка обращения к ИИ', 'details': error_body})}
    except Exception as e:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': str(e)})}
