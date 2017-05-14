<?php

namespace Group\GroupBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
/**
 * @ORM\Table(name="groupe", indexes={@ORM\Index(name="id_createur", columns={"id_createur"})})
 * @ORM\Entity(repositoryClass="Group\GroupBundle\Repository\GroupeRepository")
 * @Vich\Uploadable
*/
class Groupe
{
    /**
     * @var string
     *
     * @ORM\Column(name="nom", type="string", length=30, nullable=false)
     */
    protected $nom;

    /**
     * @var string
     *
     * @ORM\Column(name="membres", type="string", length=100, nullable=true)
     */
    protected $membres;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=255, nullable=false)
     */
    protected $description;

    /**
     * @var string
     *
     * @ORM\Column(name="photoCouverture", type="string", length=255, nullable=true)
     */
    protected $photocouverture;

    /**
     * @var string
     *
     * @ORM\Column(name="listePublications", type="string", length=255, nullable=true)
     */
    protected $listepublications;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_creation", type="date", nullable=true)
     */
    protected $dateCreation;

    /**
     * @var string
     *
     * @ORM\Column(name="listsuggestion_createur", type="string", length=255, nullable=true)
     */
    protected $listsuggestionCreateur;

    /**
     * NOTE: This is not a mapped field of entity metadata, just a simple property.
     *
     * @Vich\UploadableField(mapping="groupecouverture", fileNameProperty="imageName")
     *
     * @var File
     */
    protected $imageFile;
    /**
     * @var string
     *
     * @ORM\Column(name="image_name", type="string", length=255, nullable=true)
     */
    protected $imageName;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=true)
     */
    protected $updatedAt;

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $id;

    /**
     * @var \MainBundle\Entity\Member
     *
     * @ORM\ManyToOne(targetEntity="MainBundle\Entity\Member")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_createur", referencedColumnName="id")
     * })
     */
    protected $idCreateur;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="MainBundle\Entity\Member", mappedBy="groupe")
     */
    protected $member;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Group\GroupBundle\Entity\Image", mappedBy="groupe")
     */
    protected $image;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->member = new \Doctrine\Common\Collections\ArrayCollection();
        $this->image = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * @return string
     */
    public function getNom()
    {
        return $this->nom;
    }

    /**
     * @param string $nom
     */
    public function setNom($nom)
    {
        $this->nom = $nom;
    }

    /**
     * @return string
     */
    public function getMembres()
    {
        return $this->membres;
    }

    /**
     * @param string $membres
     */
    public function setMembres($membres)
    {
        $this->membres = $membres;
    }

    /**
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getPhotocouverture()
    {
        return $this->photocouverture;
    }

    /**
     * @param string $photocouverture
     */
    public function setPhotocouverture($photocouverture)
    {
        $this->photocouverture = $photocouverture;
    }

    /**
     * @return string
     */
    public function getListepublications()
    {
        return $this->listepublications;
    }

    /**
     * @param string $listepublications
     */
    public function setListepublications($listepublications)
    {
        $this->listepublications = $listepublications;
    }

    /**
     * @return \DateTime
     */
    public function getDateCreation()
    {
        return $this->dateCreation;
    }

    /**
     * @param \DateTime $dateCreation
     */
    public function setDateCreation($dateCreation)
    {
        $this->dateCreation = $dateCreation;
    }

    /**
     * @return string
     */
    public function getListsuggestionCreateur()
    {
        return $this->listsuggestionCreateur;
    }

    /**
     * @param string $listsuggestionCreateur
     */
    public function setListsuggestionCreateur($listsuggestionCreateur)
    {
        $this->listsuggestionCreateur = $listsuggestionCreateur;
    }

    /**
     * @return File
     */
    public function getImageFile()
    {
        return $this->imageFile;
    }

    /**
     * @param File $imageFile
     */
    public function setImageFile($imageFile)
    {
        $this->imageFile = $imageFile;
    }

    /**
     * @return string
     */
    public function getImageName()
    {
        return $this->imageName;
    }

    /**
     * @param string $imageName
     */
    public function setImageName($imageName)
    {
        $this->imageName = $imageName;
    }

    /**
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * @param \DateTime $updatedAt
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return \MainBundle\Entity\Member
     */
    public function getIdCreateur()
    {
        return $this->idCreateur;
    }

    /**
     * @param \MainBundle\Entity\Member $idCreateur
     */
    public function setIdCreateur($idCreateur)
    {
        $this->idCreateur = $idCreateur;
    }

    /**
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getMember()
    {
        return $this->member;
    }

    /**
     * @param \Doctrine\Common\Collections\Collection $member
     */
    public function setMember($member)
    {
        $this->member = $member;
    }

    /**
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * @param \Doctrine\Common\Collections\Collection $image
     */
    public function setImage($image)
    {
        $this->image = $image;
    }



}

