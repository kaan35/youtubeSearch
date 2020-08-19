<?php
	namespace App\Controller;
	use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
	use Symfony\Component\Routing\Annotation\Route;
	use Symfony\Component\HttpFoundation\Request;
	use App\Service\YoutubeService;
	class PageController extends AbstractController {
		/**
		 * @Route("/", name="index")
		 */
		public function index() {
			return $this->render('page/index.html.twig', ['controller_name' => 'PageController']);
		}
		/**
		 * @Route("/search", name="search")
		 * @param Request $request
		 * @param         $YoutubeService
		 * @return void
		 */
		public function search(Request $request, YoutubeService $YoutubeService) {
			$keyword = $request->request->get('keyword');
			if (isset($keyword) && $keyword) {
				$result = $YoutubeService->search($keyword);
			} else {
				$result = ['status' => 'error', 'response' => 'Please enter a keyword to search'];
			}
			echo json_encode($result);
			die();
		}
	}