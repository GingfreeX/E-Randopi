<?php

namespace MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="home")
     */
    public function indexAction()
    {
        $em= $this->getDoctrine()->getManager();
        $users =$em->getRepository('MainBundle:Member')->findAll();
        foreach ($users  as $roles){
            if($roles->getStatusguide()===0){

            }
        }

        return $this->render('MainBundle:Default:index.html.twig');
    }
    /**
     * @Route("/About" , name="aboutUs")
     */
    public function aboutAction()
    {



        return $this->render('MainBundle:Default:aboutus.html.twig');
    }

    /**
     * @Route("/check",name="check")
     */
   public function CheckAction(){

       $authChecker = $this->get('security.authorization_checker');
       if (true === $authChecker->isGranted('ROLE_ADMIN')) {
           return $this->redirect($this->generateUrl('administration_admin_homepage'));
       }
       else if (true === $authChecker->isGranted('ROLE_GUIDE')) {
           return $this->redirect($this->generateUrl('guide_homepage'));
       }
       else if (true === $authChecker->isGranted('ROLE_MEMBRE')) {
           return $this->redirect($this->generateUrl('fos_user_profile_show'));
       }
       return null;

   }




}
