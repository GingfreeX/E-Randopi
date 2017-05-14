<?php

namespace Group\GroupBundle\Entity;

use Doctrine\ORM\Mapping as ORM;


/**
 * Image
 *
 * @ORM\Table(name="image", indexes={@ORM\Index(name="id_user", columns={"id_user"}), @ORM\Index(name="id_groupe", columns={"id_groupe"})})
 * @ORM\Entity
 */
class Image
{

/**
* @var string
*
* @ORM\Column(name="name", type="string", length=255, nullable=false)
*/
    private $name;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_publication", type="date", nullable=false)
     */
    private $datePublication;

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var \MainBundle\Entity\Member
     *
     * @ORM\ManyToOne(targetEntity="MainBundle\Entity\Member")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_user", referencedColumnName="id")
     * })
     */
    private $idUser;

    /**
     * @var \Group\GroupBundle\Entity\Groupe
     *
     * @ORM\ManyToOne(targetEntity="Group\GroupBundle\Entity\Groupe")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_groupe", referencedColumnName="id")
     * })
     */
    private $idGroupe;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Group\GroupBundle\Entity\Groupe", inversedBy="image")
     * @ORM\JoinTable(name="images_groups",
     *   joinColumns={
     *     @ORM\JoinColumn(name="image_id", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="groupe_id", referencedColumnName="id")
     *   }
     * )
     */
    private $groupe;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->groupe = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return \DateTime
     */
    public function getDatePublication()
    {
        return $this->datePublication;
    }

    /**
     * @param \DateTime $datePublication
     */
    public function setDatePublication($datePublication)
    {
        $this->datePublication = $datePublication;
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
    public function getIdUser()
    {
        return $this->idUser;
    }

    /**
     * @param \MainBundle\Entity\Member $idUser
     */
    public function setIdUser($idUser)
    {
        $this->idUser = $idUser;
    }

    /**
     * @return Groupe
     */
    public function getIdGroupe()
    {
        return $this->idGroupe;
    }

    /**
     * @param Groupe $idGroupe
     */
    public function setIdGroupe($idGroupe)
    {
        $this->idGroupe = $idGroupe;
    }

    /**
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getGroupe()
    {
        return $this->groupe;
    }

    /**
     * @param \Doctrine\Common\Collections\Collection $groupe
     */
    public function setGroupe($groupe)
    {
        $this->groupe = $groupe;
    }
    

}
