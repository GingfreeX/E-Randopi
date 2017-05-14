<?php

namespace Guide\GuideBundle\Controller;


use FOS\RestBundle\Controller\Annotations\Route;
use Guide\GuideBundle\Form\RandonneType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class RandonneController extends Controller
{
    public function SupprimerAction($id)
    {
      $em = $this->getDoctrine()->getManager();
        $rando = $em->getRepository('GuideGuideBundle:Randonne')->find($id);
        $em->remove($rando);

        $em->flush();
        return $this->redirectToRoute('guide_homepage');
    }
    public function ModifierAction(Request $request,$id){

        $em = $this->getDoctrine()->getManager();
        $rando = $em->getRepository('GuideGuideBundle:Randonne')->find($id);
        $form = $this->createForm(RandonneType::class,$rando);
        $form->handleRequest($request);
if($form->isValid()){
    $em->persist($rando);
    $em->flush();
    return $this->redirectToRoute('guide_homepage');
}
        return $this->render('@GuideGuide/Default/modifrando.html.twig',array('form2'=>$form->createView()));

    }

    public function showalleventsAction($type){
        $em = $this->getDoctrine()->getManager();
        $events = $em->getRepository('GuideGuideBundle:Randonne')->findBy(array('type'=>$type));
        $pub = $em->getRepository('MainBundle:PublicationE')->findBy(array('Section'=>$type));

        return $this->render('@GuideGuide/Default/showallevent.twig',array('events'=>$events,'type'=>$type,'pub'=>$pub));


    }


    public function showmoreDetailAction($id){
        $em=$this->getDoctrine()->getManager();
        $rando = $em->getRepository('GuideGuideBundle:Randonne')->find($id);
        $participant = explode('/',$rando->getlisteInscrits());
        $listpar =array();
        foreach($participant as $p ){
           if($em->getRepository('MainBundle:Member')->find($p)){
               $user=$em->getRepository('MainBundle:Member')->find($p);
               array_push($listpar,$user );
           }
        }
        return $this->render('@GuideGuide/Default/moredetail.html.twig',array('listpar'=>$listpar,'rando'=>$rando));
    }
    public  function envoyerMailAction($id,$idr){
        $em=$this->getDoctrine()->getManager();
        $user = $em->getRepository('MainBundle:Member')->find($id);
        $rando = $em->getRepository('GuideGuideBundle:Randonne')->find($idr);
        $list = explode('/',$rando->getListalreadysendmail());
        foreach($list as $l ){
            if($l == $id){
                return $this->render('@Main/Default/errormessageshandler.html.twig',array('message'=>"vous avez deja envoyer un email a cette personne"));
            }
        }

        $message = \Swift_Message::newInstance()
            ->setSubject('Hello Email')
            ->setFrom('erandopi14@gmail.com')
            ->setTo($user->getEmail())
            ->setBody(
                     'veuiller payer pour le rando'.$rando->getTitre().''
                );
        $this->get('mailer')->send($message);

        $rando->setListalreadysendmail($rando->getListalreadysendmail().'/'.$id);
        $em->persist($rando);
        $em->flush();
        return $this->redirectToRoute('guide_homepage');



    }

    public function pdfAction($id)
    {
        $em=$this->getDoctrine()->getManager();
        $rando = $em->getRepository('GuideGuideBundle:Randonne')->find($id);
        $participant = explode('/',$rando->getlisteInscrits());
        $listpar =array();
        foreach($participant as $p ){
            if($em->getRepository('MainBundle:Member')->find($p)){
                $user=$em->getRepository('MainBundle:Member')->find($p);
                array_push($listpar,$user );
            }
        }

        //on stocke la vue � convertir en PDF, en n'oubliant pas les param�tres twig si la vue comporte des donn�es dynamiques
        $html = $this->renderView('@GuideGuide/Default/pdffile.html.twig', array('listpar'=>$listpar,'rando'=>$rando));

        //on instancie la classe Html2Pdf_Html2Pdf en lui passant en param�tre
        //le sens de la page "portrait" => p ou "paysage" => l
        //le format A4,A5...
        //la langue du document fr,en,it...
        $html2pdf = $this->get('html2pdf_factory')->create('P', 'A4', 'en', true, 'UTF-8', array(10, 15, 10, 15));

        //SetDisplayMode d�finit la mani�re dont le document PDF va �tre affich� par l�utilisateur
        //fullpage : affiche la page enti�re sur l'�cran
        //fullwidth : utilise la largeur maximum de la fen�tre
        //real : utilise la taille r�elle
        $html2pdf->pdf->SetDisplayMode('real');





        //writeHTML va tout simplement prendre la vue stocker dans la variable $html pour la convertir en format PDF
        $html2pdf->writeHTML($html);

        //Output envoit le document PDF au navigateur internet avec un nom sp�cifique qui aura un rapport avec le contenu � convertir (exemple : Facture, R�glement�)
        // $html2pdf->Output('Facture.pdf');

        $content = $html2pdf->Output('', true);
        $response = new Response();
        $response->setContent($content);
        $response->headers->set('Content-Type', 'application/force-download');
        $response->headers->set('Content-disposition', 'filename=liste-contact.pdf');

        return $response;
    }
}
