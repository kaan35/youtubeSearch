<?php
	namespace App\Service;
	use Google_Client;
	use Google_Service_Exception;
	use Google_Service_YouTube;
	class YoutubeService {
		public function search($keyword) {
			$developerKey = $_ENV['GOOGLE_API_KEY'];
			$client       = new Google_Client();
			$client->setDeveloperKey($developerKey);
			$guzzleClient = new \GuzzleHttp\Client(["curl" => [CURLOPT_SSL_VERIFYPEER => false]]);
			$client->setHttpClient($guzzleClient);
			$youtube = new Google_Service_YouTube($client);
			try {
				$searchResponse = $youtube->search->listSearch('id,snippet', [
					'q'          => $keyword,
					'maxResults' => 50,
				]);
				$videos         = [];
				foreach ($searchResponse['items'] as $item) {
					$videos[] = [
						'id'           => $item['id']['videoId'],
						'title'        => $item['snippet']['title'],
						'description'  => $item['snippet']['description'],
						'thumbnail'    => $item['snippet']['thumbnails']['high']['url'],
						'channelTitle' => $item['snippet']['channelTitle'],
					];
				}
				$result = ['status' => 'success', 'videos' => $videos];
			} catch (Google_Service_Exception $e) {
				$errorDetail = json_decode($e->getMessage());
				if ($errorDetail->error->code == 403) {
					$result = ['status' => 'error', 'response' => 'The request cannot be completed because you have exceeded your quota'];
				} else {
					$result = ['status' => 'error', 'response' => $errorDetail->error->message];
				}
			}
			return $result;
		}
	}
