<?php

namespace Administration\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Ob\HighchartsBundle\Highcharts\Highchart;

class DefaultController extends Controller
{
    public function loginAction()
    {
        return $this->render('AdministrationAdminBundle:Admin/Layout:login.html.twig');
    }
    public function indexAction()
    {
        return $this->render('AdministrationAdminBundle:Admin/Views:acceuil.html.twig');
    }

    public function boiteReceptionAction()
    {
        return $this->render('AdministrationAdminBundle:Admin/Views:boite_reception.html.twig');
    }
    public function calendrierAction()
    {
        return $this->render('AdministrationAdminBundle:Admin/Views:calendrier.html.twig');
    }
    public function listedemandeAction()
    {
        return $this->render('AdministrationAdminBundle:Admin/Views:listedemande.html.twig');
    }
    public function listeguideAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        $Guide = $em->getRepository("MainBundle:Member")->createQueryBuilder('u')
            ->select('u')->where('u.roles LIKE :p')
            ->setParameter('p','%ROLE_GUIDE%')
            ->getQuery()->getResult();



        return $this->render("AdministrationAdminBundle:Admin/Views:listeguide.html.twig",array("guides" => $Guide));
    }
    public  function  ApprouverGuideAction($id){
      $em = $this->getDoctrine()->getManager();
        $guide = $em->getRepository('MainBundle:Member')->find($id);
        $guide->setEnabled(true);
        $em->persist($guide);
        $em->flush();
        return $this->redirectToRoute('administration_admin_liste_guide');
    }
    public function listemembreAction()
    {
        $em = $this->getDoctrine()->getManager();
        $Membre = $em->getRepository("MainBundle:Member")->findAll();
        return $this->render("@AdministrationAdmin/Admin/Views/listemembre.html.twig",array("membres" => $Membre));
    }
    public function deleteGuideAction($idguide){
        $em=$this->getDoctrine()->getManager();
        $Guide=$em
            ->getRepository("AdministrationAdminBundle:Guide")
            ->find($idguide);
        $em->remove($Guide);
        $em->flush();
        return $this->redirectToRoute("administration_admin_liste_guide");
    }
    public function bannirMembreAction($id){
        $em = $this->getDoctrine()->getManager();
        $user =$em->getRepository('MainBundle:Member')->find($id);
        $user->setEnabled(false);
        $em->persist($user);
        $em->flush();
        return $this->redirectToRoute('administration_admin_liste_membre');
    }

    public function listpublAction()
    {
        $em = $this->getDoctrine()->getManager();
        $pub = $em->getRepository('ShopBundle:Produit')->findAll();

        return $this->render('AdministrationAdminBundle:Admin/Views:listepub.html.twig',array('pub'=>$pub));
    }
    public function deletepubAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $pub = $em->getRepository('ShopBundle:Produit')->find($id);
        $em->remove($pub);

        $em->flush();

        return $this->redirectToRoute("administration_admin_liste_publication");
    }

    public function statAction()
    {
        $series = array(
            array("name" => "Data Serie Name",    "data" => array(1,2,4,5,6,3,8))
        );

        $ob = new Highchart();
        $ob->chart->renderTo('linechart');  // The #id of the div where to render the chart
        $ob->title->text('Chart Title');
        $ob->xAxis->title(array('text'  => "Horizontal axis title"));
        $ob->yAxis->title(array('text'  => "Vertical axis title"));
        $ob->series($series);

        return $this->render('AdministrationAdminBundle:Admin/Views:statistique.html.twig', array(
            'chart' => $ob
        ));
    }

}
