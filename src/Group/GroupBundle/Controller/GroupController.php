<?php

namespace Group\GroupBundle\Controller;


use Group\GroupBundle\Entity\Commentaire;
use Group\GroupBundle\Entity\Groupe;

use Group\GroupBundle\Entity\Image;
use Group\GroupBundle\Entity\Publication;
use Group\GroupBundle\Form\GroupeType;
use Group\GroupBundle\Form\PublicationType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


/**
 * @property  container
 */
class GroupController extends Controller
{


    public function addgroupAction(Request $request)
    {

        if ($request->isXmlHttpRequest() && $request->isMethod('post')) {
            $groupe = new Groupe();
            $nom = $request->get('nom');
            $des = $request->get('des');
            $groupe->setNom($nom);
            $groupe->setDescription($des);
            $em = $this->getDoctrine()->getManager();
            $createur = $em->getRepository('MainBundle:Member')->findOneBy(array('id'=>$this->getUser()));
            $groupe->setIdCreateur($createur);

            $em->persist($groupe);
            $em->flush();
            $response = " Groupe  creer";
            return new JsonResponse($response);
        }
        return $this->render('@GroupGroup/Group/groupe_mur_base.html.twig');
    }


    public function newGroupeAction(Request $request, $id)
    {

        $em = $this->getDoctrine()->getManager();
        $pub = new Publication();
        $form = $this->createForm(PublicationType::class, $pub);

        $form->handleRequest($request);


        $user = $em->getRepository('MainBundle:Member')->findOneBy(array('id' => $this->getUser()));
        $group = $em->getRepository('GroupGroupBundle:Groupe')->find($id);


        $nbmember = $em->getRepository('GroupGroupBundle:Groupe')->countNumberMember($group->getId());
        $memberimg = $em->getRepository('GroupGroupBundle:Groupe')->getGroupMember($group->getId());
        $groupphoto = $em->getRepository('GroupGroupBundle:Groupe')->getGroupImg($group->getId());
        $photoNumber = $em->getRepository('GroupGroupBundle:Groupe')->countGroupPhoto($group->getId());


        //$accutualgroup = $em->getRepository('GroupGroupBundle:Groupe')->find($id);

        /*---------------- recup?er la liste des username des amis  de l'utilisateur acctuellment conn?ct? ---*/
        // $listuser = $em->getRepository('GroupGroupBundle:Groupe')->showautolist($accutualgroup->getListsuggestionCreateur());


        if ($form->isValid() && $form->isSubmitted()) {

            $data = $form->getData();
            $txtpub = $data->getDescription();
            $image = $data->getPhoto();
            $photo = $image->getClientOriginalName();

            $file = $pub->getPhoto();

            $fileName = md5(uniqid()) . '.' . $file->guessExtension();

            $file->move(
                $this->getParameter('groupe_images'),
                $fileName
            );


            if ($txtpub == '' && $photo != '') {
                $pub->setDescription("\"\"");
                $pub->setUser($user);
                $pub->setGroup($group);
                $pub->setDatepub(new \DateTime());
                $pub->setPhoto($fileName);
                $pub->setNbrjaime(0);
                $img = new Image();
                $img->setIdGroupe($group);
                $img->setDatePublication(new \DateTime());
                $img->setIdUser($user);
                $img->setName($fileName);
            } else if ($txtpub != '' && $photo == '') {
                $pub->setUser($user);
                $pub->setGroup($group);
                $pub->setDatepub(new \DateTime());
                $pub->setPhoto("\"\"");
                $pub->setNbrjaime(0);
            } else {
                $pub->setUser($user);
                $pub->setGroup($group);
                $pub->setDatepub(new \DateTime());
                $pub->setPhoto($fileName);
                $pub->setNbrjaime(0);
                $img = new Image();
                $img->setIdGroupe($group);
                $img->setDatePublication(new \DateTime());
                $img->setIdUser($user);
                $img->setName($fileName);

            }


            $em->persist($pub);
            $em->persist($img);

            $em->flush();
            return $this->redirectToRoute('group_new', array('id' => $id));
        }
        $publ = $em->getRepository('GroupGroupBundle:Publication')->findBy(array('group' => $group));
        $comment = $em->getRepository('GroupGroupBundle:Commentaire')->findAll();




        //get group description
        $descgrp = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id' => $id))->getDescription();

        // get memberstring
        // $str = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id'=>$id));
        //get array member with arrtibute
        //$memberphoto = $em->getRepository("GroupGroupBundle:Groupe")->getmemberphotos($id);

        // $member = $em->getRepository("GroupGroupBundle:Groupe")->getmembernumber($id);

        // get image string
        //$stri = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id'=>$id));
        // get array image with attribute
        //$groupephotos = $em->getRepository("GroupGroupBundle:Image")->getgroupephotos($id);

        //$images = $em->getRepository("GroupGroupBundle:Image")->getphotonumber($id);

        $coverpic = $this->createForm(GroupeType::class, $group);
        $coverpic->handleRequest($request);
        $actualuser = $em->getRepository('MainBundle:Member')->findOneBy(array('id'=>$this->getUser()));
        $listamis = $actualuser->getListeAmis();
        $li = explode('/',$listamis);
        $listamisuser = array();
        $listmembres = array();
      $listm= explode('/',$group->getMembres());
$exist = false;

        foreach($li as $value){

            foreach($listm as $lo){

                if($lo === $value){
if($amiss =$em->getRepository('MainBundle:Member')->find($lo)) {
    $amiss = $em->getRepository('MainBundle:Member')->find($lo);
    array_push($listmembres, $amiss);
}
                }else{
                    if($em->getRepository('MainBundle:Member')->find($value)){
                        $amis =$em->getRepository('MainBundle:Member')->find($value);
                        array_push($listamisuser,$amis);
                    }


                }
            }









        }


        if ($coverpic->isValid() && $coverpic->isSubmitted()) {

            $em->persist($group);
            $em->flush();
            return $this->redirectToRoute('group_new', array('id' => $id));

        }
        return $this->render('@GroupGroup/layout/newGroupe.html.twig', array("id" => $id,'listm'=>$listmembres

        ,'li'=>$listamisuser ,'pub' => $publ, 'form' => $form->createView(), "desc" => $descgrp, "user" => $user->getProfilePic(), 'coverform' => $coverpic->createView(), 'coverpic' => $group->getPhotocouverture(), 'nbm' => $nbmember, 'memberimg' => $memberimg, 'groupimg' => $groupphoto, 'photonumber' => $photoNumber,'comment'=>$comment));

    }

    public function addmembergroupAction($id, $idm)
    {

        $em = $this->getDoctrine()->getManager();
        $group = $em->getRepository("GroupGroupBundle:Groupe")->find($id);
        $listamis = explode('/', $group->getListsuggestionCreateur());

        if (($key = array_search($idm, $listamis)) !== false) {
            unset($listamis[$key]);
            $group->setMembres($group->getMembres() . '/' . $idm);

        }

        $listamis = implode('/', $listamis);
        $group->setListsuggestionCreateur($listamis);

        $em->persist($group);
        $em->flush();

        return $this->redirectToRoute('group_new', array('id' => $id));

    }


    public function deletepubAction($idpub, $id)
    {

        $em = $this->getDoctrine()->getManager();
        $pub = $em->getRepository('GroupGroupBundle:Publication')->find($idpub);
        $em->remove($pub);
        $em->flush();
        return $this->redirectToRoute('group_new', array('id' => $id));
    }

    public function updatepubAction(Request $request, $idpub, $id)
    {

        $em = $this->getDoctrine()->getManager();
        $pub = $em->getRepository('GroupGroupBundle:Publication')->find($idpub);
        $txt = $request->get('txt');
        $pub->setDescription($txt);
        $em->persist($pub);
        $em->flush();
        return $this->redirectToRoute('group_new', array('id' => $id));
    }


    /* public function commentpubAction(Request $request, $idpub, $id)
     {
         $em = $this->getDoctrine()->getManager();
         $user = $em->getRepository('MainBundle:Member')->findOneBy(array('id' => $this->getUser()));

         $descgrp = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id' => $id))->getDescriptiongroupe();

         // get memberstring
         // $str = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id'=>$id));
         //get array member with arrtibute
         $memberphoto = $em->getRepository("GroupGroupBundle:Groupe")->getmemberphotos($id);

         $member = $em->getRepository("GroupGroupBundle:Groupe")->getmembernumber($id);

         // get image string
         //$stri = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id'=>$id));
         // get array image with attribute
         $groupephotos = $em->getRepository("GroupGroupBundle:Image")->getgroupephotos($id);

         $images = $em->getRepository("GroupGroupBundle:Image")->getphotonumber($id);

         $pub = $em->getRepository('GroupGroupBundle:Publication')->find($idpub);


         return $this->render('@GroupGroup/layout/comment.html.twig', array('id' => $id, 'pub' => $pub, "mem" => $memberphoto, "nb" => $member, "img" => $groupephotos, "desc" => $descgrp, "imgnb" => $images, "user" => $user->getProfilePic()));
     }*/


    public function membreGroupeAction(Request $request, $id)
    {

        $em = $this->getDoctrine()->getManager();

        //get group description
        $descgrp = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id' => $id))->getDescriptiongroupe();

        // get member string
        // $str = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id'=>$id));
        //get array member with arrtibute
        $memberphoto = $em->getRepository("GroupGroupBundle:Groupe")->getmemberphotos($id);

        $member = $em->getRepository("GroupGroupBundle:Groupe")->getmembernumber($id);

        // recupere objet membres
        $m = $em->getRepository("GroupGroupBundle:Groupe")->getmemberobygroup($id);

        // get image string
        //$stri = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id'=>$id));
        // get array image with attribute
        $groupephotos = $em->getRepository("GroupGroupBundle:Image")->getgroupephotos($id);

        $images = $em->getRepository("GroupGroupBundle:Image")->getphotonumber($id);
        $accutualgroup = $em->getRepository('GroupGroupBundle:Groupe')->find($id);


        $listuser = $em->getRepository('GroupGroupBundle:Groupe')->showautolist($accutualgroup->getListsuggestionCreateur());


        //$member = $em->getRepository("GroupGroupBundle:Groupe")->getmemberlist($str->getMembres());

        // get image string
        //$stri = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id'=>$id));
        // get array image with attribute
        //$images = $em->getRepository("GroupGroupBundle:Image")->getimagelist($stri->getListimage());

        $coverpic = $this->createForm(GroupeType::class, $accutualgroup);
        $coverpic->handleRequest($request);


        if ($coverpic->isValid() && $coverpic->isSubmitted()) {

            $em->persist($accutualgroup);
            $em->flush();
            return $this->redirectToRoute('group_group_membres', array('id' => $id));

        }


        $paginator = $this->get('knp_paginator');
        $res = $pagination = $paginator->paginate(
            $m, /* query NOT result */
            $request->query->getInt('page', 1),       /*page number*/
            $request->query->getInt('limit', 4)        /*limit per page*/
        );

        return $this->render('@GroupGroup/layout/membres.html.twig', array("id" => $id, "mem" => $res, "nb" => $member,
            "img" => $groupephotos, "mem1" => $memberphoto, "desc" => $descgrp, "imgnb" => $images, 'listuser' => $listuser, 'coverform' => $coverpic->createView(), 'coverpic' => $accutualgroup->getImageName()));

    }

    public function photosGroupeAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        //get group description
        $descgrp = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id' => $id))->getDescriptiongroupe();


        $memberphoto = $em->getRepository("GroupGroupBundle:Groupe")->getmemberphotos($id);

        $member = $em->getRepository("GroupGroupBundle:Groupe")->getmembernumber($id);

        // get image string
        //$stri = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id'=>$id));
        // get array image with attribute
        $groupephotos = $em->getRepository("GroupGroupBundle:Image")->getgroupephotos($id);

        $images = $em->getRepository("GroupGroupBundle:Image")->getphotonumber($id);

        $accutualgroup = $em->getRepository('GroupGroupBundle:Groupe')->find($id);
        $listuser = $em->getRepository('GroupGroupBundle:Groupe')->showautolist($accutualgroup->getListsuggestionCreateur());


        // get member string
        //$strm = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id'=>$id));
        //get array member with attribute
        //$member = $em->getRepository("GroupGroupBundle:Groupe")->getmemberlist($strm->getMembres());


        // get image string
        //$str = $em->getRepository("GroupGroupBundle:Groupe")->findOneBy(array('id'=>$id));
        //get array of image with attribute

        // $images = $em->getRepository("GroupGroupBundle:Image")->getimagelist($str->getListimage());

        $coverpic = $this->createForm(GroupeType::class, $accutualgroup);
        $coverpic->handleRequest($request);


        if ($coverpic->isValid() && $coverpic->isSubmitted()) {

            $em->persist($accutualgroup);
            $em->flush();
            return $this->redirectToRoute('group_group_membres', array('id' => $id));

        }


        $paginator = $this->get('knp_paginator');
        $res = $pagination = $paginator->paginate(
            $groupephotos, /* query NOT result */
            $request->query->getInt('page', 1),       /*page number*/
            $request->query->getInt('limit', 8)        /*limit per page*/
        );
        return $this->render('@GroupGroup/layout/photos.html.twig', array("id" => $id, "img" => $res, "img2" => $groupephotos, "mem" => $memberphoto, "nb" => $member, "nbi" => $images, "desc" => $descgrp, 'listuser' => $listuser, 'coverform' => $coverpic->createView(), 'coverpic' => $accutualgroup->getImageName()));

    }
  public function  ajouterMembreAction($idm,$id){
      $em= $this->getDoctrine()->getManager();
      $groupe = $em->getRepository('GroupGroupBundle:Groupe')->find($id);


      $groupe->setMembres($groupe->getMembres().'/'.$idm);
      $em->persist($groupe);
      $em->flush();
      return $this->redirectToRoute('group_new',array('id'=>$id));
  }
    public function addcommentAction(Request $request, $idpub, $id)
    {

        $em = $this->getDoctrine()->getManager();
        $pub = $em->getRepository('GroupGroupBundle:Publication')->findOneBy(array('id' => $idpub));
        $user = $em->getRepository('MainBundle:Member')->findOneBy(array('id' => $id));


        $comment = new Commentaire();
        $txt = $request->get('txt');
        $comment->setIdUser($user);
        $comment->setIdPub($pub);
        $comment->setText($txt);
        $comment->setDatePub(new \DateTime());
        $em->persist($comment);
        $em->flush();

        return $this->redirectToRoute('group_new', array('id' => $id));
    }


}
