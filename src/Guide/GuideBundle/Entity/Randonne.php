<?php
namespace Guide\GuideBundle\Entity ;
use Doctrine\ORM\Mapping as ORM ;

/**
 * @ORM\Entity();
 */
class Randonne
{
    /**
     * @ORM\id();
     * @ORM\GeneratedValue();
     * @ORM\Column(type="integer");
     */
    private $id  ;
    /**
     * @ORM\Column(type="string");
     */
    private $titre  ;
    /**
     * @ORM\Column(type="string",nullable=true);
     */
    private $description  ;
    /**
     * @ORM\Column(type="integer",nullable=true);
     */
    private $id_guide  ;
    /**
     * @ORM\Column(type="string",nullable=true);
     */
    private $destination  ;
    /**
     * @ORM\Column(type="datetime",nullable=true);
     */
    private $date  ;
    /**
     * @ORM\Column(type="string" ,nullable=true);
     */
    private $liste_inscrits  ;
    /**
     * @ORM\Column(type="float",nullable=true);
     */
    private $prix  ;
    /**
     * @ORM\Column(type="string",nullable=true);
     */
    private $image  ;
    /**
     * @ORM\Column(type="integer",nullable=true);
     */
    private $nbr_places ;
    /**
     * @ORM\Column(type="string",nullable=true);
     */
    private $pointDepart ;
    /**
     * @ORM\Column(type="string",nullable=true);
     */
    private $type ;
    /**
     * @ORM\Column(type="integer",nullable=true);
     */
    private $niveau ;
    /**
     * @ORM\Column(type="integer",nullable=true);
     */
    private $ageMin ;
    /**
     * @ORM\Column(type="string",nullable=true);
     */
    private $moyenTransport ;
    /**
     * @ORM\Column(type="string",nullable=true);
     */
    private $plan ;
    /**
     * @ORM\Column(type="string",nullable=true);
     */
    private $listalreadysendmail;

    /**
     * @return mixed
     */
    public function getListalreadysendmail()
    {
        return $this->listalreadysendmail;
    }

    /**
     * @param mixed $listalreadysendmail
     */
    public function setListalreadysendmail($listalreadysendmail)
    {
        $this->listalreadysendmail = $listalreadysendmail;
    }


    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getTitre()
    {
        return $this->titre;
    }

    /**
     * @param mixed $titre
     */
    public function setTitre($titre)
    {
        $this->titre = $titre;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return mixed
     */
    public function getIdGuide()
    {
        return $this->id_guide;
    }

    /**
     * @param mixed $id_guide
     */
    public function setIdGuide($id_guide)
    {
        $this->id_guide = $id_guide;
    }

    /**
     * @return mixed
     */
    public function getDestination()
    {
        return $this->destination;
    }

    /**
     * @param mixed $destination
     */
    public function setDestination($destination)
    {
        $this->destination = $destination;
    }

    /**
     * @return mixed
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param mixed $date
     */
    public function setDate($date)
    {
        $this->date = $date;
    }

    /**
     * @return mixed
     */
    public function getlisteInscrits()
    {
        return $this->liste_inscrits;
    }

    /**
     * @param mixed $liste_inscrits
     */
    public function setListeInscrits($liste_inscrits)
    {
        $this->liste_inscrits = $liste_inscrits;
    }

    /**
     * @return mixed
     */
    public function getPrix()
    {
        return $this->prix;
    }

    /**
     * @param mixed $prix
     */
    public function setPrix($prix)
    {
        $this->prix = $prix;
    }

    /**
     * @return mixed
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * @param mixed $image
     */
    public function setImage($image)
    {
        $this->image = $image;
    }

    /**
     * @return mixed
     */
    public function getNbrPlaces()
    {
        return $this->nbr_places;
    }

    /**
     * @param mixed $nbr_places
     */
    public function setNbrPlaces($nbr_places)
    {
        $this->nbr_places = $nbr_places;
    }

    /**
     * @return mixed
     */
    public function getPointDepart()
    {
        return $this->pointDepart;
    }

    /**
     * @param mixed $pointDepart
     */
    public function setPointDepart($pointDepart)
    {
        $this->pointDepart = $pointDepart;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * @return mixed
     */
    public function getNiveau()
    {
        return $this->niveau;
    }

    /**
     * @param mixed $niveau
     */
    public function setNiveau($niveau)
    {
        $this->niveau = $niveau;
    }

    /**
     * @return mixed
     */
    public function getAgeMin()
    {
        return $this->ageMin;
    }

    /**
     * @param mixed $ageMin
     */
    public function setAgeMin($ageMin)
    {
        $this->ageMin = $ageMin;
    }

    /**
     * @return mixed
     */
    public function getMoyenTransport()
    {
        return $this->moyenTransport;
    }

    /**
     * @param mixed $moyenTransport
     */
    public function setMoyenTransport($moyenTransport)
    {
        $this->moyenTransport = $moyenTransport;
    }

    /**
     * @return mixed
     */
    public function getPlan()
    {
        return $this->plan;
    }

    /**
     * @param mixed $plan
     */
    public function setPlan($plan)
    {
        $this->plan = $plan;
    }



}