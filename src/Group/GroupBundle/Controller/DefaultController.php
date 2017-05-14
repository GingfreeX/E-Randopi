<?php

namespace Group\GroupBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('GroupGroupBundle:Default:index.html.twig');
    }
}
