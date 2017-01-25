<?php

namespace MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="home")
     */
    public function indexAction()
    {
        return $this->render('MainBundle:Default:index.html.twig');
    }
    /**
     * @Route("/About" , name="aboutUs")
     */
    public function aboutAction()
    {
        return $this->render('MainBundle:Default:aboutus.html.twig');
    }
}
