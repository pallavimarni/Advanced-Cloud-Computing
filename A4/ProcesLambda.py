import json


def lambda_handler(event, context):

    action = event['action']
    value = event['value']


    response = {
        'action': action,
        'value': value
    }


    return response
