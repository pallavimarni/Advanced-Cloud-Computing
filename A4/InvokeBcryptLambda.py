import json
import bcrypt
import requests

def lambda_handler(event, context):
    action = event['action']
    value = event['value']

    if action == 'bcrypt':

        hashed_value = bcrypt.hashpw(value.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        response = {
            'banner': "B00928652",
            'result': hashed_value,
            'arn': "arn:aws:lambda:us-east-1:587818610762:function:InvokeBcryptLambda",
            'action': 'bcrypt',
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
            response = requests.post("https://v7qaxwoyrb.execute-api.us-east-1.amazonaws.com/default/end", json=post_data)
            response.raise_for_status()

            # Attempt to parse the JSON response
            result_data = response.json()

            # Return None if the JSON response is empty
            if not result_data:
                return None

            return result_data
        except requests.exceptions.RequestException as e:

            return {
                'state': 'PostRequestError',
                'error_message': str(e)
            }
        except json.JSONDecodeError as e:

            return {
                'state': 'InvalidResponseFormat',
                'error_message': str(e)
            }
    else:
        return {
            'state': 'InvalidActionState',
            'input': {
                'action': action,
                'value': value
            }
        }

