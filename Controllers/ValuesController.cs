using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using FinalGroupProject.Models;
using System;
using System.Net;
using Newtonsoft.Json;
using Google.Cloud.Speech.V1;
using static Google.Cloud.Speech.V1.RecognitionConfig.Types;

namespace FinalGroupProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase {

        private readonly AppDbContext _context;
        public ValuesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<int[]> Get() {
            return new int[] {1,2,3,4,5};
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/translate
        [HttpPost("translate")]
        public RecognizeResponse translate([FromBody] string filename)
        {
            
            string path = "C:\\Users\\Dell\\Downloads\\"+filename;
            RecognitionAudio audio = RecognitionAudio.FromFile(path);
            //RecognitionAudio audio2 = RecognitionAudio.FetchFromUri("https://storage.googleapis.com/cloud-samples-tests/speech/brooklyn.flac");
            //RecognitionAudio audio3 = RecognitionAudio.FromStorageUri("gs://my-bucket/my-file");

            /* byte[] bytes = ReadAudioData(); // For example, from a database
             RecognitionAudio audio4 = RecognitionAudio.FromBytes(bytes);

             using (Stream stream = OpenAudioStream()) // Any regular .NET stream
             {
                 RecognitionAudio audio5 = RecognitionAudio.FromStream(stream);
             }*/

            SpeechClient client = SpeechClient.Create();
            RecognitionConfig config = new RecognitionConfig
            {
                Encoding = AudioEncoding.Linear16,
                SampleRateHertz = 48000,
                LanguageCode = LanguageCodes.English.UnitedStates
            };
            RecognizeResponse response = client.Recognize(config, audio);
            return response;
        }

        // POST api/nearby
        [HttpPost("getnearby")]
        public IEnumerable<FavLocation> getnearby([FromBody] Form formData)
        {
            using (var webClient = new WebClient())
            {
                webClient.Headers.Add("user-key", "AIzaSyAqGtr1YRUsR9twvDRZt1rydrjdt70f5hA");
                webClient.Headers.Add("Accept", "application/json");
                string url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + formData.latitude + "," + formData.longitude + "&radius=" + formData.radius + "&type=" + formData.type + "&key=AIzaSyAqGtr1YRUsR9twvDRZt1rydrjdt70f5hA";
                
                String rawData = webClient.DownloadString(url);
                dynamic json = JsonConvert.DeserializeObject(rawData);
                List<FavLocation> nearloc = new List<FavLocation>();
                int i = 1;
                int length = json.results.Count;
                if(json.status == "OK")
                {
                    foreach (var data in json.results)
                    {
                        FavLocation loc = new FavLocation();
                        loc.Latitude = data.geometry.location.lat;
                        loc.Longitude = data.geometry.location.lng;
                        loc.PlaceName = data.name;
                        nearloc.Add(loc);
                    }
                }

                return nearloc;
            }
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}