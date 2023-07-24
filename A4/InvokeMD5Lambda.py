import json
import hashlib
import requests

def lambda_handler(event, context):
    action = event['input']['action']
    value = event['input']['value']

    if action == 'md5':
        hashed_value = hashlib.md5(value.encode('utf-8')).hexdigest()
        print("Hashed Value:", hashed_value)

        response = {
            'banner': "B00928652",
            'result': hashed_value,
            'arn': "arn:aws:lambda:us-east-1:587818610762:function:InvokeMD5Lambda",
            'action': 'md5',
            'value': value
        }

        post_data = {
            "banner": response["banner"],
            "result": response["result"],
            "arn": response["arn"],
            "action": response["action"],
            "value": response["value"]
        }


        try:
            response = requests.post("https://v7qaxwoyrb.execute-api.us-east-1.amazoarn:aws:lambda:us-east-1:587818610762:function:InvokeMD5Lambdanaws.com/default/end", json=post_data)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:

            return {
                'state': 'PostRequestError',
                'error_message': str(e)
            }

        return response.json()
    else:
        return {
            'state': 'InvalidActionState',
            'input': {
                'action': action,
                'value': value
            }
        }

