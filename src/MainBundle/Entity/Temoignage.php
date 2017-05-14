<?php
/**
 * Created by PhpStorm.
 * User: cimope
 * Date: 14/02/2017
 * Time: 18:37
 */

namespace MainBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
/**
 *
 *
 *
 * @ORM\Entity
 */

class Temoignage
{

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     *
     */
private $id ;

    /**
     * @ORM\ManyToOne(targetEntity="MainBundle\Entity\Member")
     *
     */
    private $iduser;

    /**
     * @ORM\Column(type="string" )
     */
    private $message;

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
    public function getIduser()
    {
        return $this->iduser;
    }

    /**
     * @param mixed $iduser
     */
    public function setIduser($iduser)
    {
        $this->iduser = $iduser;
    }

    /**
     * @return mixed
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param mixed $message
     */
    public function setMessage($message)
    {
        $this->message = $message;
    }


}