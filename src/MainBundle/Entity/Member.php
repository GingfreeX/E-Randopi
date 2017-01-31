<?php

namespace MainBundle\Entity;
use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;

/**
 * Member
 *
 * @ORM\Table(name="member")
 * @ORM\Entity
 */
class Member extends BaseUser
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $id;

    public function getId()
    {
        return $this->id;
    }
    public function __construct()
    {
        parent::__construct();
        // your own logic
    }
    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $age;
    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    protected $prenom;
    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    protected $nom;
    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    protected $description;
    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    protected $location;
    /**
     * @ORM\Column(type="date", nullable=true)
     */
    protected $joined;
    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    protected $facebook;
    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    protected $twitter;
    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $nbr_amis;
    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    protected $liste_amis;
    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    protected $profile_pic;
    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    protected $cover_pic;

    /**
     * @return mixed
     */
    public function getAge()
    {
        return $this->age;
    }

    /**
     * @param mixed $age
     */
    public function setAge($age)
    {
        $this->age = $age;
    }

    /**
     * @return mixed
     */
    public function getPrenom()
    {
        return $this->prenom;
    }

    /**
     * @param mixed $prenom
     */
    public function setPrenom($prenom)
    {
        $this->prenom = $prenom;
    }

    /**
     * @return mixed
     */
    public function getNom()
    {
        return $this->nom;
    }

    /**
     * @param mixed $nom
     */
    public function setNom($nom)
    {
        $this->nom = $nom;
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
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * @param mixed $location
     */
    public function setLocation($location)
    {
        $this->location = $location;
    }

    /**
     * @return mixed
     */
    public function getJoined()
    {
        return $this->joined;
    }

    /**
     * @param mixed $joined
     */
    public function setJoined($joined)
    {
        $this->joined = $joined;
    }

    /**
     * @return mixed
     */
    public function getFacebook()
    {
        return $this->facebook;
    }

    /**
     * @param mixed $facebook
     */
    public function setFacebook($facebook)
    {
        $this->facebook = $facebook;
    }

    /**
     * @return mixed
     */
    public function getTwitter()
    {
        return $this->twitter;
    }

    /**
     * @param mixed $twitter
     */
    public function setTwitter($twitter)
    {
        $this->twitter = $twitter;
    }

    /**
     * @return mixed
     */
    public function getNbrAmis()
    {
        return $this->nbr_amis;
    }

    /**
     * @param mixed $nbr_amis
     */
    public function setNbrAmis($nbr_amis)
    {
        $this->nbr_amis = $nbr_amis;
    }

    /**
     * @return mixed
     */
    public function getListeAmis()
    {
        return $this->liste_amis;
    }

    /**
     * @param mixed $liste_amis
     */
    public function setListeAmis($liste_amis)
    {
        $this->liste_amis = $liste_amis;
    }

    /**
     * @return mixed
     */
    public function getProfilePic()
    {
        return $this->profile_pic;
    }

    /**
     * @param mixed $profile_pic
     */
    public function setProfilePic($profile_pic)
    {
        $this->profile_pic = $profile_pic;
    }

    /**
     * @return mixed
     */
    public function getCoverPic()
    {
        return $this->cover_pic;
    }

    /**
     * @param mixed $cover_pic
     */
    public function setCoverPic($cover_pic)
    {
        $this->cover_pic = $cover_pic;
    }


}

