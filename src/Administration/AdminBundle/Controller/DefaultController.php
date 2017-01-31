<?php

namespace Administration\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

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
        return $this->render('AdministrationAdminBundle:Admin/Views:listeguide.html.twig');
    }
    public function listemembreAction()
    {
        return $this->render('AdministrationAdminBundle:Admin/Views:listemembre.html.twig');
    }

    public function listpublAction()
    {
        return $this->render('AdministrationAdminBundle:Admin/Views:listepub.html.twig');
    }

    public function statAction()
    {
        return $this->render('AdministrationAdminBundle:Admin/Views:statistique.html.twig');
    }
}
