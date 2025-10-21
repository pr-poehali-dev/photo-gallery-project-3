'''
Business: API для работы с комментариями к фотоисториям
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с комментариями или статусом операции
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        story_id = params.get('story_id')
        
        if story_id:
            cur.execute(
                "SELECT id, story_id, author, text, to_char(created_at, 'DD Mon') as date FROM comments WHERE story_id = %s ORDER BY created_at DESC",
                (int(story_id),)
            )
        else:
            cur.execute(
                "SELECT id, story_id, author, text, to_char(created_at, 'DD Mon') as date FROM comments ORDER BY created_at DESC"
            )
        
        comments = cur.fetchall()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps([dict(c) for c in comments], ensure_ascii=False)
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        story_id = body_data.get('story_id')
        author = body_data.get('author', '').strip()
        text = body_data.get('text', '').strip()
        
        if not story_id or not author or not text:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Missing required fields'})
            }
        
        cur.execute(
            "INSERT INTO comments (story_id, author, text) VALUES (%s, %s, %s) RETURNING id, story_id, author, text, to_char(created_at, 'DD Mon') as date",
            (story_id, author, text)
        )
        new_comment = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps(dict(new_comment), ensure_ascii=False)
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
