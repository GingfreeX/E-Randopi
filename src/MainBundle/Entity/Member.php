<?php

namespace MainBundle\Entity;
use Doctrine\Common\Collections\ArrayCollection;
use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;
use Mgilet\NotificationBundle\Model\UserNotificationInterface;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Member
 *
 * @ORM\Table(name="member")
 * @ORM\Entity
 * @Vich\Uploadable
 */
class Member extends BaseUser implements UserNotificationInterface
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $id;
    /**
     * @var Notification
     * @ORM\OneToMany(targetEntity="MainBundle\Entity\Notification", mappedBy="user", orphanRemoval=true,cascade={"persist"})
     */
    protected $notifications;
    public function getId()
    {
        return $this->id;
    }
    public function __construct()
    {
        parent::__construct();
        // your own logic
        $this->notifications = new ArrayCollection();
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
     * @var string
     *
     * @ORM\Column(name="profile_pic", type="string", length=200, nullable=true)
     * @Assert\Image()
     */
    protected $profilePic;
    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    protected $cover_pic;
    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Group\GroupBundle\Entity\Groupe", inversedBy="member")
     * @ORM\JoinTable(name="users_groups",
     *   joinColumns={
     *     @ORM\JoinColumn(name="member_id", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="groupe_id", referencedColumnName="id")
     *   }
     * )
     */
    protected $groupe;
    /**
     *  @ORM\Column(type="string", length=200, nullable=true)
     */
    protected $listinvitation ;
    /**
     * @ORM\Column(type="integer",nullable=true)
     */
    protected $statusguide;
    /**
     * NOTE: This is not a mapped field of entity metadata, just a simple property.
     *
     * @Vich\UploadableField(mapping="product_cv", fileNameProperty="FileName",nullable=true)
     *
     * @var File
     */
    private $Filecv;

    /**
     * @ORM\Column(type="string", length=255,nullable=true)
     *
     * @var string
     */
    private $FileName;

    /**
     * If manually uploading a file (i.e. not using Symfony Form) ensure an instance
     * of 'UploadedFile' is injected into this setter to trigger the  update. If this
     * bundle's configuration parameter 'inject_on_load' is set to 'true' this setter
     * must be able to accept an instance of 'File' as the bundle will inject one here
     * during Doctrine hydration.
     *
     *@param File|\Symfony\Component\HttpFoundation\File\UploadedFile $Filecv
     *
     * @return Member
     */
    public function getFilecv()
    {
        return $this->Filecv;
    }
    public function setFilecv(File $file = null)
    {
        $this->Filecv = $file;

        if ($file) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't be called and the file is lost
            $this->updatedAt = new \DateTimeImmutable();
        }

        return $this;
    }


    /**
     * @return string
     */
    public function getFileName()
    {
        return $this->FileName;
    }

    /**
     * @param string $FileName
     */
    public function setFileName($FileName)
    {
        $this->FileName = $FileName;
    }


    /**
     * NOTE: This is not a mapped field of entity metadata, just a simple property.
     *
     * @Vich\UploadableField(mapping="photo_profil", fileNameProperty="imageName")
     *
     * @var File
     */
    private $imageFile;

    /**
     * @ORM\Column(type="string", length=255,nullable=true)
     *
     * @var string
     */
    private $imageName;

    /**
     * @ORM\Column(type="datetime",nullable=true)
     *
     * @var \DateTime
     */
    private $updatedimageAt;

    /**
     * If manually uploading a file (i.e. not using Symfony Form) ensure an instance
     * of 'UploadedFile' is injected into this setter to trigger the  update. If this
     * bundle's configuration parameter 'inject_on_load' is set to 'true' this setter
     * must be able to accept an instance of 'File' as the bundle will inject one here
     * during Doctrine hydration.
     *
     * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile $image
     *
     * @return Member
     */
    public function setImageFile(File $image = null)
    {
        $this->imageFile = $image;

        if ($image) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't be called and the file is lost
            $this->updatedimageAt = new \DateTimeImmutable();
        }

        return $this;
    }


    /**
     * @return File|null
     */
    public function getImageFile()
    {
        return $this->imageFile;
    }

    /**
     * @param string $imageName
     *
     * @return Member
     */
    public function setImageName($imageName)
    {
        $this->imageName = $imageName;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getImageName()
    {
        return $this->imageName;
    }




    public function getStatusguide()
    {
        return $this->statusguide;
    }

    /**
     * @param mixed $statusguide
     */
    public function setStatusguide($statusguide)
    {
        $this->statusguide = $statusguide;
    }


    /**
     * @return mixed
     */
    public function getListinvitation()
    {
        return $this->listinvitation;
    }

    /**
     * @param mixed $listinvitation
     */
    public function setListinvitation($listinvitation)
    {
        $this->listinvitation = $listinvitation;
    }
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
    public function getnbr_amis()
    {
        return $this->nbr_amis;
    }

    /**
     * @param mixed $nbr_amis
     */
    public function setnbr_amis($nbr_amis)
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
        return $this->profilePic;
    }

    /**
     * @param mixed $profile_pic
     */
    public function setProfilePic($profile_pic)
    {
        $this->profilePic = $profile_pic;
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
    public function getNotifications()
    {
        return $this->notifications;
    }

    /**
     * {@inheritdoc}
     */
    public function addNotification($notification)
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications[] = $notification;
            $notification->setUser($this);
        }

        return $this;
    }

    /**
     * {@inheritdoc}
     */
    public function removeNotification($notification)
    {
        if ($this->notifications->contains($notification)) {
            $this->notifications->removeElement($notification);
        }

        return $this;
    }

    /**
     * {@inheritdoc}
     */
    public function getIdentifier()
    {
        $this->getId();
    }

}

