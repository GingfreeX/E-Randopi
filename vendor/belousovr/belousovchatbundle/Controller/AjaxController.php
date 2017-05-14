<?php
/**
 * Created by Roman Belousov
 * Date: 09.04.16
 */

namespace belousovr\belousovChatBundle\Controller;

use belousovr\belousovChatBundle\Entity\Messages;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use belousovr\belousovChatBundle\Form\ChatType;

/**
 * @Route("/belousovChatAjax")
 * Class AjaxController
 * @package belousovr\belousovChatBundle\Controller
 */
class AjaxController extends Controller
{
    /**
     * @Route("/belousovChatSendMessage", name="belousov_chat_ajax_send_message")
     * @param $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function sendMessageAction(Request $request)
    {
        $body = null;
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');

        if (!$this->getUser()) {
            $body = array('error' => 'user not found');
            $response->setContent(json_encode($body));
            return $response;
        } else {
            $body = array('success' => 'success');
        }

        $em = $this->getDoctrine()->getManager();

        $recipient = $this->container->get('fos_user.user_manager');
        $addressee = $recipient->findUserBy(array('id' => $request->get('addressee')));

        $message = new Messages();

        $message->setMessageText($request->get('messageText'));
        $message->setAuthor($this->getUser());
        $message->setAddressee($addressee);
        $message->setReading(false);

        $em->persist($message);

        $em->flush();

        $response->setContent(json_encode($body));
        return $response;
    }

    /**
     * @Route("/belousovChatGetMessage", name="belousov_chat_ajax_get_message")
     * @param $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getMessage(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $response = new Response();
        $body = null;

        $user_id = $request->get('user_id');
        $addressee = $request->get('addressee_id');
        $update = $request->get('update');
        $changeUser = $request->get('changeUser');

        if (isset($update)) {
            $update = $em->getRepository(Messages::class)->getMessageLongPolling($user_id, $addressee);
            foreach ($update->getResult() as $item) {
                $item->setReading(true);
                $em->persist($item);
            }

            $em->flush();

            $response->setContent(json_encode(array('success' => 'success')));
            return $response;
        }

        if (isset($changeUser)) {
            $messages = $em->getRepository(Messages::class)->getMessages($this->getUser(), $request->get('user_id'));
            if (!empty($messages)) {
                foreach ($messages as $item) {
                    $body[] = $item;
                }
            }
            $response->setContent(json_encode($body));
            return $response;
        }

        if (!$user_id or !$addressee) {
            $body = array('error' => 'user not found');
            $response->setContent(json_encode($body));
            return $response;
        }

        $check = $em->getRepository(Messages::class)->getMessageLongPolling($user_id, $addressee);

        while(empty($check->getArrayResult())){
            usleep(100000);
            clearstatcache();
            session_write_close();
            $check = $em->getRepository(Messages::class)->getMessageLongPolling($user_id, $addressee);
        }

        if (!empty($check->getArrayResult())) {
            foreach ($check->getArrayResult() as $item) {
                $body[] = $item;
            }
        }

        $response->setContent(json_encode($body));
        return $response;
    }
}