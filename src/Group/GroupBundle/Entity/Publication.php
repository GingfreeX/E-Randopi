<?php

namespace Group\GroupBundle\Entity;
use Doctrine\ORM\Mapping as ORM ;
use Symfony\Component\Validator\Constraints as Assert;

    /**
     * Publication
     *
     * @ORM\Table(name="publication", indexes={@ORM\Index(name="IDX_AF3C6779A76ED395", columns={"user_id"}), @ORM\Index(name="IDX_AF3C6779FE54D947", columns={"group_id"})})
     * @ORM\Entity
     */
class Publication
{
    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    protected $description;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="datepub", type="datetime", nullable=true)
     */
    protected $datepub;

    /**
     * @var string
     *
     * @ORM\Column(name="photo", type="string", length=100, nullable=true)
     * @Assert\Image()
     */
    protected $photo;


    /**
     * @var integer
     *
     * @ORM\Column(name="nbrjaime", type="integer", nullable=true)
     */
    protected $nbrjaime;

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $id;

    /**
     * @var \Group\GroupBundle\Entity\Groupe
     *
     * @ORM\ManyToOne(targetEntity="Group\GroupBundle\Entity\Groupe")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="group_id", referencedColumnName="id")
     * })
     */
    protected $group;

    /**
     * @var \MainBundle\Entity\Member
     *
     * @ORM\ManyToOne(targetEntity="MainBundle\Entity\Member")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */

    protected $user;
    

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
     * @return \DateTime
     */
    public function getDatepub()
    {
        return $this->datepub;
    }

    /**
     * @param \DateTime $datepub
     */
    public function setDatepub($datepub)
    {
        $this->datepub = $datepub;
    }

    /**
     * @return string
     */
    public function getPhoto()
    {
        return $this->photo;
    }

    /**
     * @param string $photo
     */
    public function setPhoto($photo)
    {
        $this->photo = $photo;
    }

    /**
     * @return int
     */
    public function getNbrjaime()
    {
        return $this->nbrjaime;
    }

    /**
     * @param int $nbrjaime
     */
    public function setNbrjaime($nbrjaime)
    {
        $this->nbrjaime = $nbrjaime;
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
     * @return Groupe
     */
    public function getGroup()
    {
        return $this->group;
    }

    /**
     * @param Groupe $group
     */
    public function setGroup($group)
    {
        $this->group = $group;
    }

    /**
     * @return \MainBundle\Entity\Member
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param \MainBundle\Entity\Member $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    

}

