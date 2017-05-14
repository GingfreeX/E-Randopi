<?php
/**
 * Created by PhpStorm.
 * User: aloulou
 * Date: 18/02/2017
 * Time: 03:23
 */

namespace MainBundle\Entity;
use Doctrine\ORM\Mapping as ORM ;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
/**
 * @ORM\Entity()
 * @Vich\Uploadable
 */
class PublicationE
{
    /**
     * @var integer
     *
     * @ORM\Column(type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue()
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $description;
    /**
     * @var string
     *
     * @ORM\Column(name="image", type="string", length=255, nullable=true)
     */
    private $image;
    /**
     * NOTE: This is not a mapped field of entity metadata, just a simple property.
     *
     * @Vich\UploadableField(mapping="publication_cv", fileNameProperty="image")
     *
     * @var File
     */
    private $imageFile;
    /**
     * @param string $imageName
     *
     * @return PublicationE
     */
    public function setImage($image)
    {
        $this->image = $image;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile $image
     * @return PublicationE
     */
    public function setImageFile(File $image = null)
    {
        $this->imageFile = $image;

        if ($image) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't be called and the file is lost
            $this->updatedAt = new \DateTimeImmutable();
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
     * @ORM\Column(type="string", length=100, nullable=true)
     */
   private $Section;

    /**
     * @ORM\ManyToOne(targetEntity="MainBundle\Entity\Member")
     */


private $user ;

    /**
     *@ORM\Column(type="datetime", length=100, nullable=true)
     */
private  $datepub;
    public function __construct()
    {
        $this->datepub = new \DateTime();
    }

    /**
     * @return mixed
     */
    public function getSection()
    {
        return $this->Section;
    }

    /**
     * @param mixed $Section
     */
    public function setSection($Section)
    {
        $this->Section = $Section;
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


    public function getId()
    {
        return $this->id;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Publication
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }



    /**
     * Set datepub
     *
     * @param \DateTime $datepub
     *
     * @return Publication
     */
    public function setDatepub($datepub)
    {
        $this->datepub = $datepub;

        return $this;
    }

    /**
     * Get datepub
     *
     * @return \DateTime
     */
    public function getDatepub()
    {
        return $this->datepub;
    }

}