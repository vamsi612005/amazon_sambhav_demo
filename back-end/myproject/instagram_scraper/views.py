import os
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render

@csrf_exempt
def scrape_instagram(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body.decode('utf-8'))
            instagram_link = data.get('instagramLink', '')
            picture_count = data.get('pictureCount', 1)
            description = data.get('description', '')

            if not instagram_link or 'instagram.com' not in instagram_link:
                return JsonResponse({"error": "Invalid Instagram link"}, status=400)

            # Setup WebDriver (Chrome in this case)
            driver = webdriver.Chrome()  # Ensure ChromeDriver is installed and accessible
            driver.get(instagram_link)
            
            # Wait for the page to load
            time.sleep(15)  # Adjust based on your internet speed
            
            # Create a directory to save images
            folder_name = "instagram_images"
            if not os.path.exists(folder_name):
                os.makedirs(folder_name)
            
            # Find all image elements
            image_elements = driver.find_elements(By.TAG_NAME, 'img')

            images = []
            for idx, img in enumerate(image_elements):
                image_url = img.get_attribute('src')
                if image_url:
                    try:
                        # Send a GET request to the image URL
                        img_data = requests.get(image_url).content
                        
                        # Save the image to the folder
                        img_name = os.path.join(folder_name, f"image_{idx+1}.jpg")
                        with open(img_name, 'wb') as file:
                            file.write(img_data)
                        images.append(image_url)
                        
                        if len(images) >= picture_count:
                            break
                    except Exception as e:
                        continue
            
            # Close the WebDriver
            driver.quit()
            
            # Call the external API with the description
            api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
            api_key = "AIzaSyD08otinE_9XfqeCsTnvvz5QKi3HB4mKYE"
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": f"Create various components as mentioned from the description:{description}, Format it into a json object in the format {{'Name':'Name','Feature1':'Feature','Feature2':'Feature','Benefit1':'Benefit','Benefit2':'Benefit','Price':'Price'}}"
                            }
                        ]
                    }
                ]
            }
            
            api_response = requests.post(f"{api_url}?key={api_key}", headers=headers, json=payload)

            
            
            if api_response.status_code == 200:
                # Extract and destringify the API response
                raw_text = api_response.json().get('contents', [{}])[0].get('parts', [{}])[0].get('text', '{}')
                print(raw_text)
                try:
                    destringified_response = json.loads(raw_text)  # Convert stringified JSON to a Python dictionary
                except json.JSONDecodeError:
                    destringified_response = {"error": "Invalid JSON format in API response"}
            else:
                destringified_response = {"error": "API call failed", "status_code": api_response.status_code}
            print(destringified_response)
            # Return the list of images and API response
            return JsonResponse({
                "images": images[:picture_count],
                "description": description,
                "apiResponse": destringified_response
            })
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Only POST method is supported"}, status=405)
