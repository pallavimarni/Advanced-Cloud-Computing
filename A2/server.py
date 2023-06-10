import grpc
from concurrent import futures
import computeandstorage_pb2
import computeandstorage_pb2_grpc
import boto3
import requests

s3_bucket_name = 'a2-b00928652'
s3_client = None

def check_aws_credentials():
    try:

        global s3_client
        s3_client = boto3.client('s3')
        s3_client.list_buckets()
        return True
    except Exception as e:
        print("AWS credential check failed:", str(e))
        return False

class EC2OperationsServicer(computeandstorage_pb2_grpc.EC2OperationsServicer):
    def StoreData(self, request, context):
        if s3_client is None:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details("AWS credentials are not valid")
            return computeandstorage_pb2.StoreReply()

        data = request.data

        object_key = 'file.txt'


        s3_client.put_object(Body=data, Bucket=s3_bucket_name, Key=object_key)

        s3_url = f"https://{s3_bucket_name}.s3.us-east-1.amazonaws.com/{object_key}"
        print("Generated S3 URL:", s3_url)

        return computeandstorage_pb2.StoreReply(s3uri=s3_url)

    def AppendData(self, request, context):
        if s3_client is None:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details("AWS credentials are not valid")
            return computeandstorage_pb2.AppendReply()

        s3_uri = "https://a2-b00928652.s3.us-east-1.amazonaws.com/file.txt"
        data = request.data

        try:
          
            response = requests.get(s3_uri)
            existing_data = response.text

        
            updated_data = existing_data + data

        
            response = requests.put(s3_uri, data=updated_data)
            if response.status_code != 200:
        
                pass

            return computeandstorage_pb2.AppendReply()
        except Exception as e:
 
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return computeandstorage_pb2.AppendReply()

    def DeleteFile(self, request, context):
        if s3_client is None:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details("AWS credentials are not valid")
            return computeandstorage_pb2.DeleteReply()

        s3_uri = request.s3uri

        try:
         
            object_key = s3_uri.split('/')[-1]

      
            s3_client.delete_object(Bucket=s3_bucket_name, Key=object_key)
            
            return computeandstorage_pb2.DeleteReply()
        except Exception as e:
       
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return computeandstorage_pb2.DeleteReply()


def serve():
    if not check_aws_credentials():
        return

    server = grpc.server(futures.ThreadPoolExecutor())
    computeandstorage_pb2_grpc.add_EC2OperationsServicer_to_server(EC2OperationsServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server running")

    server.wait_for_termination()

if __name__ == '__main__':
    serve()
