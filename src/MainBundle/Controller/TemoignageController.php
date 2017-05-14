<?php

namespace MainBundle\Controller;

use MainBundle\Entity\Temoignage;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class TemoignageController extends Controller
{

    public function addTestAction(Request $request){
        $tem = new Temoignage();
          $message = $request->get('message');
        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository('MainBundle:Member')->findOneBy(array('id'=>$this->getUser()));
        $tem->setIduser($user);
        $tem->setMessage($message);
        $em->persist($tem);
        $em->flush();


    }
}
