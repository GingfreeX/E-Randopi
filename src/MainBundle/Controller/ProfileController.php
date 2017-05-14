<?php

/*
 * This file is part of the FOSUserBundle package.
 *
 * (c) FriendsOfSymfony <http://friendsofsymfony.github.com/>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace MainBundle\Controller;
use belousovr\belousovChatBundle\Form\ChatType;
use FOS\UserBundle\Event\FilterUserResponseEvent;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\Form\Factory\FactoryInterface;
use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Model\UserManagerInterface;
use Group\GroupBundle\Entity\Publication;
use Guide\GuideBundle\Entity\Randonne;
use MainBundle\Entity\commentairesurpub;
use MainBundle\Entity\PublicationE;
use MainBundle\Entity\Temoignage;
use MainBundle\Form\MemberType;
use MainBundle\Form\PublicationEType;
use MainBundle\Form\TemoignageType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use ShopBundle\Entity\Produit;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use ShopBundle\Form\ProductAddForm;
/**
 * Controller managing the user profile.
 *
 * @author Christophe Coevoet <stof@notk.org>
 */
class ProfileController extends Controller
{
    /**
     * Show the user.
     */
    public function showAction(Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $all = $em->getRepository('MainBundle:Member')->findAll();
        $accutualuser = $em->getRepository('MainBundle:Member')->findOneBy(array('id'=>$this->getUser()));
        $users = array();
        foreach($all as $item) {
        $array = explode('/', $item->getListinvitation());
/*---------------controle si id de getUser existe dans les inviatation des membre */
    foreach($array as $item1){

        if($item1==$accutualuser->getId()){
            $exist=true;
        }else{
           $exist=false;
        }}


            if($exist==false){
                if($item->getId() != $accutualuser->getId()){

                    array_push($users,$item);


                }

            }
        }
/*----------------- retrouver tt les invitation  */
$invitation=explode('/', $accutualuser->getListinvitation());
$listinvitations = array();

        foreach($invitation as $item2){

if($em->getRepository('MainBundle:Member')->find($item2)){
    $inv=$em->getRepository('MainBundle:Member')->find($item2);

          array_push($listinvitations,$inv);
}
}
/*---------------------on veut que dans les suggsettion d'amis no amis ne vont pas figurer ---------*/
$listamis = explode('/',$accutualuser->getListeAmis());
 foreach($listamis as $item3){
if($em->getRepository('MainBundle:Member')->find($item3)){
    $u = $em->getRepository('MainBundle:Member')->find($item3);
    if(($key = array_search($u, $users)) !== false){
unset($users[$key]);
    }

}
    }
/*---------------- recup�er la liste d'amis de l'utilisateur acctuellment conn�ct� ---*/
     $listamisuser = array();
        foreach($listamis as $item3){
            if($em->getRepository('MainBundle:Member')->find($item3)){
                $amis =$em->getRepository('MainBundle:Member')->find($item3);
             array_push($listamisuser,$amis);
                }

            }

/*-------------------------chataction------------------------------------------*/





        $actionUrl = $this->generateUrl(
            'belousov_chat_ajax_send_message'
        );

        $getMessageUrl = $this->generateUrl(
            'belousov_chat_ajax_get_message'
        );

        $chatForm = $this->createForm(ChatType::class, null, array('action' => $actionUrl));




/*-------------------------------------------------------------------------------------*/
$pub2 = new PublicationE();
$form3 = $this->createForm(PublicationEType::class,$pub2);
$form3->handleRequest($request);
        if($form3->isSubmitted() && $form3->isValid()){
            $user3 = $em->getRepository('MainBundle:Member')->findOneBy(array('id'=>$this->getUser()));
            $pub2->setUser($user3);
            $em->persist($pub2);
            $em->flush();

        }
$publication = $em->getRepository('MainBundle:PublicationE')->findBy(array('user'=>$this->getUser()));


/****************************************************************************************/
 $user = $this->getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }
        $Produit= new Produit();
        $form= $this->createForm(ProductAddForm::class,$Produit);
        $form->handleRequest($request);
        if($form->isValid()){
            $em = $this->getDoctrine()->getManager();
            $member=$this->getUser();
            $Produit->setIdMembre($member->getId());
            $em->persist($Produit);
            $em->flush();
        }
        $form5 = $this->createForm(MemberType::class,$accutualuser);
       $form5->handleRequest($request);
        if($form5->isSubmitted() && $form5->isValid()){

            $file = $accutualuser->getProfilePic();

            $fileName = md5(uniqid()) . '.' . $file->guessExtension();

            $file->move(
                $this->getParameter('profile_images'),
                $fileName
            );
            $accutualuser->setProfilePic($fileName);
            $em->persist($accutualuser);
            $em->flush();
        }
 /*-------------------------add item for sale --------------------------*/
        $Produit= new Produit();
        $form8= $this->createForm(ProductAddForm::class,$Produit);
        $form8->handleRequest($request);
        if($form8->isValid()){
            $em = $this->getDoctrine()->getManager();
            $member=$this->getUser();
            $Produit->setIdMembre($member->getId());
            $em->persist($Produit);
            $em->flush();
            return $this->redirectToRoute('fos_user_profile_show');
        }

 /*-------------------------------------Groups---------------------------------*/
        $groups = $em->getRepository('GroupGroupBundle:Groupe')->findBy(array('idCreateur'=>$accutualuser));

 /*------------------------------------------------------------------------*/
      return $this->render('@FOSUser/Profile/show.html.twig', array(
            'user' => $user,'formm'=>$form->createView(),'all'=>$users,'listinvi'=>$listinvitations,'listamis'=>$listamisuser
       ,'form3'=>$form3->createView(),'form5'=>$form5->createView(),
          'pub'=>$publication,'chatForm' => $chatForm->createView(), 'users' => $listamisuser, 'getMessageUrl' => $getMessageUrl, 'currentUser' => $this->getUser()
          ,'form8'=>$form8->createView(),'groupes'=>$groups


        ));}


    /**
     * Edit the user.
     *
     * @param Request $request
     *
     * @return Response
     */
    public function editAction(Request $request)
    {
        $user = $this->getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        /** @var $dispatcher EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        /** @var $formFactory FactoryInterface */
        $formFactory = $this->get('fos_user.profile.form.factory');

        $form = $formFactory->createForm();
        $form->setData($user);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var $userManager UserManagerInterface */
            $userManager = $this->get('fos_user.user_manager');

            $event = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_SUCCESS, $event);

            $userManager->updateUser($user);

            if (null === $response = $event->getResponse()) {
                $url = $this->generateUrl('fos_user_profile_show');
                $response = new RedirectResponse($url);
            }

            $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_COMPLETED, new FilterUserResponseEvent($user, $request, $response));

            return $response;
        }

        return $this->render('@FOSUser/Profile/edit.html.twig', array(
            'form' => $form->createView(),
        ));
    }
    /**

     * @Route("/",name="fos_user_profile_x")
     */
    public function xAction(Request $request)
    {
        if($request->isXmlHttpRequest()) {
        $username = $request->get('username');
        $nom= $request->get('nom');
        $prenom= $request->get('prenom');
        $age= $request->get('age');
        $location= $request->get('location');
        $email= $request->get('email');
        $facebook= $request->get('facebook');
        $twitter= $request->get('twitter');
        $description= $request->get('description');
        $id= $request->get('id');
        $conn = $this->get('database_connection');
        $query="UPDATE member SET username='".$username."',nom='".$nom."',prenom='".$prenom."',age=".$age.",location='".$location."',email='".$email."',facebook='".$facebook."',twitter='".$twitter."',description='".$description."' where id=".$id;
        $statement=$conn->prepare($query);
        $statement->execute();
        }
        return new Response("You did not give an ajax query!");
    }

    /**
     * @Route("/envoyerinvi/{id}",name="envoyerinvi")
     */
    public function EnovoyerInvitationAction($id){
      $em = $this->getDoctrine()->getManager();
        $userdes = $em->getRepository('MainBundle:Member')->find($id);
        $accualuser = $em->getRepository('MainBundle:Member')->findOneBy(array('id'=>$this->getUser()));

        $listinv =$userdes->getListinvitation()."/".$accualuser->getId();
        $userdes->setListinvitation($listinv);
         $em->persist($userdes);
        $em->flush();
        $manager = $this->get('mgilet.notification');
        $notif = $manager->generateNotification($this->getUser()."   vous a envoyer une invitation");
       $manager->addNotification($userdes, $notif);

return $this->render('@Main/Default/errormessageshandler.html.twig',array('message'=>"invitation envoyée à ".$userdes->getUsername().""));

    }

    /**
     * @Route("/app/{id}",name="approuver")
     */

    public function ApprouverinviAction($id){
        $em= $this->getDoctrine()->getManager();
$accualuser = $em->getRepository('MainBundle:Member')->findOneBy(array('id'=>$this->getUser()));
$listinvi = explode('/',$accualuser->getListinvitation());
        if(($key = array_search($id, $listinvi)) !== false) {
            unset($listinvi[$key]);
        }
        $userdes = $em->getRepository('MainBundle:Member')->find($id);
        $accualuser->setListeAmis($accualuser->getListeAmis()."/".$id);
        $accualuser->setListinvitation(implode('/',$listinvi));
        $userdes->setListeAmis($userdes->getListeAmis()."/".$accualuser->getId());
        $em->persist($accualuser);
        $em->persist($userdes);
        $em->flush();
        $manager = $this->get('mgilet.notification');
        $notif = $manager->generateNotification($this->getUser()."  a accepter votre  invitation");
        $manager->addNotification($userdes, $notif);
        return $this->redirectToRoute('fos_user_profile_show');
    }


    /**
     * @Route("/par/{id}",name="par")
     */
    public  function ParticiperAction($id){
       $em= $this->getDoctrine()->getManager();
        $acctualuser = $em->getRepository('MainBundle:Member')->findOneBy(array('id'=>$this->getUser()));
       $Rando = $em->getRepository('GuideGuideBundle:Randonne')->find($id);
        $listparticipant = explode('/',$Rando->getlisteInscrits());
        foreach($listparticipant as $participant ){
            if($participant == $acctualuser->getId() ){

                return $this->render('@Main/Default/errormessageshandler.html.twig',array('message'=>"vous etes deja inscrits à cet événement"));
            }
        }

        if($Rando->getNbrPlaces()==0){
            return $this->render('@Main/Default/errormessageshandler.html.twig',array('message'=>"Evenement complet"));

        }
        $Rando->setNbrPlaces($Rando->getNbrPlaces()-1);
        $Rando->setListeInscrits($Rando->getlisteInscrits()."/".$acctualuser->getId());


        $em->persist($Rando);
        $em->flush();
        return $this->redirectToRoute('fos_user_profile_show');
    }
    /**
     * @Route("/supp/{id}",name="supprimerpublication")
     */
    public function supprimerpubAction($id){
        $em = $this->getDoctrine()->getManager();
        $pub = $em->getRepository('MainBundle:PublicationE')->find($id);
        $em->remove($pub);
        $em->flush();
        return $this->redirectToRoute('fos_user_profile_show');
    }
    /**
     * @Route("/modif/{id}",name="modifpublication")
     */
    public function modifpubAction($id,Request $request){
        $em = $this->getDoctrine()->getManager();
        $pub = $em->getRepository('MainBundle:PublicationE')->find($id);

        $form3 = $this->createForm(PublicationEType::class,$pub);
        $form3->handleRequest($request);
        if($form3->isSubmitted() && $form3->isValid()){
            $user3 = $em->getRepository('MainBundle:Member')->findOneBy(array('id'=>$this->getUser()));
            $pub->setUser($user3);
            $em->persist($pub);
            $em->flush();
return $this->redirectToRoute('fos_user_profile_show');
        }
        return $this->render('@FOSUser/Profile/modifierpublication.html.twig',array('form3'=>$form3->createView()));
    }

    /**
     *
     * @Route("profile/showevent/{type}",name="showallevent")
     */
    public function showalleventsforAction($type)
    {
        $em = $this->getDoctrine()->getManager();
        $events = $em->getRepository('GuideGuideBundle:Randonne')->findBy(array('type'=>$type));
        $pub = $em->getRepository('MainBundle:PublicationE')->findBy(array('Section'=>$type));
        return $this->render('MainBundle:Default:showevent.html.twig',array('events'=>$events,'type'=>$type,'pub'=>$pub));

    }

    /**
     *
     * @Route("Post/{id}",name="post")
     */
    public function showPostAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $pub = $em->getRepository('MainBundle:PublicationE')->find($id);
        $commentaires = $em->getRepository('MainBundle:commentairesurpub')->findBy(array('publicatione'=>$pub));
        $nbrcomment =count($commentaires);
        return $this->render('MainBundle:Default:post.html.twig',array('pub'=>$pub,'comment'=>$commentaires,'nbrc'=>$nbrcomment));

    }

    /**
     *@Route("commenter",name="commenter")
     */
    public function commenterAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        if ($request->isXmlHttpRequest() && $request->isMethod('POST')) {
            $commentaire = $request->get('zone');

            $comment = new commentairesurpub();
            $postid = $request->get('postid');
            $post = $em->getRepository('MainBundle:PublicationE')->find($postid);
            $user = $em->getRepository('MainBundle:Member')->findOneBy(array('id' => $this->getUser()));
            $comment->setUser($user);
            $comment->setContent($commentaire);
            $comment->setPublicatione($post);

            $em->persist($comment);
            $em->flush();
            $comm = $em->getRepository('MainBundle:commentairesurpub')->findAll();
            $response = $this->renderView('@Main/Default/viewpost.html.twig',array('comment'=>$comm));
            return new JsonResponse($response);

        }
    }
/**
 *@Route("/suppamis/{id}",name="suppamis")
 *
 */
        public function supprimerAmisAction($id){
            $em= $this->getDoctrine()->getManager();
            $accualuser = $em->getRepository('MainBundle:Member')->findOneBy(array('id'=>$this->getUser()));
            $listamis = explode("/",$accualuser->getListeAmis());
            var_dump($listamis);
            if(($key = array_search($id, $listamis)) !== false) {
                unset($listamis[$key]);
            }
            $userdes = $em->getRepository('MainBundle:Member')->find($id);
            $listamisdes = explode("/",$userdes->getListeAmis());
            if(($key = array_search($accualuser->getId(), $listamisdes)) !== false) {
                unset($listamisdes[$key]);
            }
            $userdes->setListeAmis(implode('/',$listamisdes));
            $accualuser->setListeAmis(implode('/',$listamis));
            $em->persist($accualuser);
            $em->persist($userdes);
            $em->flush();
            return $this->redirectToRoute('fos_user_profile_show');

    }
    /**
     *@Route("/annulerinvi/{id}",name="annulerinvi")
     *
     */
    public function supprimerinviAction($id){
        $em= $this->getDoctrine()->getManager();
        $accualuser = $em->getRepository('MainBundle:Member')->findOneBy(array('id'=>$this->getUser()));
        $listinvi = explode("/",$accualuser->getListinvitation());

        if(($key = array_search($id, $listinvi)) !== false) {
            unset($listinvi[$key]);
        }
        $accualuser->setListinvitation(implode('/',$listinvi));
        $em->persist($accualuser);
         $em->flush();
        return $this->redirectToRoute('fos_user_profile_show');

    }

/**
 *@Route("/recherche",name="rech")
 */
    public function rechercheAction(Request $request){
        if($request->isXmlHttpRequest() && $request->isMethod('post')){
$search = $request->get('search');
            dump($search);
            $em = $this->getDoctrine()->getEntityManager();
            $query=$em->getRepository('MainBundle:Member')->createQueryBuilder('u');
            $users= $query->where($query->expr()->like('u.username',':p'))
                ->setParameter('p','%'.$search.'%')
              ->getQuery()->getResult();
            $response = $this->renderView('@FOSUser/Profile/listsugg.html.twig',array('all'=>$users));
            return new JsonResponse($response);
        }
    }



}
