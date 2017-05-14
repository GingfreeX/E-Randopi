<?php

namespace ShopBundle\Controller;

use ShopBundle\Entity\Productcomment;
use ShopBundle\Form\ProductAddForm;
use ShopBundle\Form\ProductCommentAddForm;
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
     * @Route("/ownitems/{id}",name="private")
     */
    public function privateAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $item = $em->getRepository('ShopBundle:Produit')->findBy(array('idMembre'=>$id));
        return $this->render('@Shop/Default/index.html.twig',array('item'=>$item));
    }
    /**
     * @Route("/itemshow/{id}-{iduser}",name="itemshow")
     */
    public function itemshowAction($id,$iduser,Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $item = $em->getRepository('ShopBundle:Produit')->find($id);
        $user = $em->getRepository('MainBundle:Member')->find($iduser);
        $comments = $em->getRepository('ShopBundle:Productcomment')->findBy(array('productid'=>$id));
        $username = $user->getUsername();
        $Comment= new Productcomment();
        $form= $this->createForm(ProductCommentAddForm::class,$Comment);
        $form->handleRequest($request);
        if($form->isValid()){
            $em = $this->getDoctrine()->getManager();
            $Comment->setProductid($id);
            $Comment->setUserid($username);
            $em->persist($Comment);
            $em->flush();
        }
        return $this->render('@Shop/Default/item.html.twig',array('itemm'=>$item,'user'=>$user,'formComment'=>$form->createView(),'comments'=>$comments));
    }
    /**
     * @Route("/like",name="likeitem")
     */
    public function likeAction(Request $request)
    {   if($request->isXmlHttpRequest()) {
        $id = $request->get('id');
        $em = $this->getDoctrine()->getManager();
        $item = $em->getRepository('ShopBundle:Produit')->find($id);
        $item->setRating($item->getRating()+1);
        $em->persist($item);
        $em->flush();
    }
        return new Response("Stop kidding and give me an ajax request");
    }


}
