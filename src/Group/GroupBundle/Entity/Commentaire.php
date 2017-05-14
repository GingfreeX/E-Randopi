<?php

namespace Group\GroupBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Comment
 *
 * @ORM\Table(name="comment", indexes={@ORM\Index(name="id_user", columns={"id_user", "id_pub"}), @ORM\Index(name="id_pub", columns={"id_pub"}), @ORM\Index(name="IDX_9474526C6B3CA4B", columns={"id_user"})})
 * @ORM\Entity
 */
class Commentaire
{
    /**
     * @var string
     *
     * @ORM\Column(name="text", type="string", length=500, nullable=false)
     */
    private $text;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_pub", type="date", nullable=false)
     */
    private $datePub;

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var \Group\GroupBundle\Entity\Publication
     *
     * @ORM\ManyToOne(targetEntity="Group\GroupBundle\Entity\Publication")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_pub", referencedColumnName="id")
     * })
     */
    private $idPub;

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
     * @return string
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * @param string $text
     */
    public function setText($text)
    {
        $this->text = $text;
    }

    /**
     * @return \DateTime
     */
    public function getDatePub()
    {
        return $this->datePub;
    }

    /**
     * @param \DateTime $datePub
     */
    public function setDatePub($datePub)
    {
        $this->datePub = $datePub;
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
     * @return Publication
     */
    public function getIdPub()
    {
        return $this->idPub;
    }

    /**
     * @param Publication $idPub
     */
    public function setIdPub($idPub)
    {
        $this->idPub = $idPub;
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

    

}

