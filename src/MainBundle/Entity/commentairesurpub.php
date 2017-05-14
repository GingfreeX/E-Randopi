<?php
/**
 * Created by PhpStorm.
 * User: cimope
 * Date: 19/02/2017
 * Time: 12:25
 */

namespace MainBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints\DateTime;

/**
 * Class commentairesurpub
 * @ORM\Entity()
 */

class commentairesurpub
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue()
     */
    private  $id;
    /**
     *@ORM\ManyToOne(targetEntity="MainBundle\Entity\Member")
     */
    private $user;
    /**
     *@ORM\ManyToOne(targetEntity="MainBundle\Entity\PublicationE")
     */
    private $publicatione;
    /**
     *@ORM\Column(type="string", nullable=false)
     *
     */
    private $content;
    /**
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $datepub;


    public function __construct()
    {
        $this->datepub =new \DateTime();
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
     * @return mixed
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param mixed $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * @return mixed
     */
    public function getPublicatione()
    {
        return $this->publicatione;
    }

    /**
     * @param mixed $publicatione
     */
    public function setPublicatione($publicatione)
    {
        $this->publicatione = $publicatione;
    }

    /**
     * @return mixed
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * @param mixed $content
     */
    public function setContent($content)
    {
        $this->content = $content;
    }

    /**
     * @return mixed
     */
    public function getDatepub()
    {
        return $this->datepub;
    }

    /**
     * @param mixed $datepub
     */
    public function setDatepub($datepub)
    {
        $this->datepub = $datepub;
    }


}