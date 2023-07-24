import json
import hashlib
import requests

def lambda_handler(event, context):

    action = event['input']['action']
    value = event['input']['value']

    if action == 'sha256':

        hashed_value = hashlib.sha256(value.encode('utf-8')).hexdigest()
        print("Hashed Value:", hashed_value)


        response = {
            'banner': "B00928652",
            'result': hashed_value,
            'arn': "arn:aws:lambda:us-east-1:587818610762:function:InvokeSHA256Lambda",
            'action': 'sha256',
            'value': value
        }


        url = "https://v7qaxwoyrb.execute-api.us-east-1.amazonaws.com/default/end"
        headers = {'Content-Type': 'application/json'}
        payload = json.dumps(response)

        try:

            response = requests.post(url, data=payload, headers=headers)
            response.raise_for_status()  # Raise an exception for non-2xx status codes
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                'error': str(e)
            }
    else:

        return {
            'state': 'InvalidActionState',
            'input': {
                'action': action,
                'value': value
            }
        }
