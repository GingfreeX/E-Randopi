<?php

namespace ShopBundle\Controller;

use ShopBundle\Form\ProductAddForm;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use MainBundle\Entity\Member;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Security\Core\User\User;
use Symfony\Component\Security\Core\Security;
use ShopBundle\Entity\Produit;

class DefaultController extends Controller
{
    /**
     * @Route("/",name="shopindex")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();
        $item = $em->getRepository('ShopBundle:Produit')->findAll();
        return $this->render('@Shop/Default/index.html.twig',array('item'=>$item));
    }
    /**
     * @Route("/itemshow/{id}-{iduser}",name="itemshow")
     */
    public function itemshowAction($id,$iduser)
    {
        $em = $this->getDoctrine()->getManager();
        $item = $em->getRepository('ShopBundle:Produit')->find($id);
        $user = $em->getRepository('MainBundle:Member')->find($iduser);
        return $this->render('@Shop/Default/item.html.twig',array('itemm'=>$item,'user'=>$user));
    }


}
